import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    // Ensure Prisma is initialized
    if (!prisma) {
      console.error('Prisma client is not initialized')
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { url, limit = 10 } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log(`Starting Mouser scrape for URL: ${url}, limit: ${limit}`)
    const scrapedProducts = await scrapeMouserProducts(url, limit)
    console.log(`Scraped ${scrapedProducts.length} products from Mouser`)
    
    if (scrapedProducts.length === 0) {
      return NextResponse.json({
        success: false,
        imported: 0,
        errors: 0,
        products: [],
        errorDetails: [],
        message: 'No products found. The scraper may not be able to parse the Mouser.com page structure. Try a different URL or add products manually.',
      })
    }
    
    // Import products into database
    const imported = []
    const errors = []

    for (const product of scrapedProducts) {
      try {
        if (!product.partNumber || !product.manufacturer) {
          errors.push({ partNumber: product.partNumber || 'Unknown', error: 'Missing part number or manufacturer' })
          continue
        }

        const existing = await prisma.product.findUnique({
          where: { partNumber: product.partNumber },
        })

        if (existing) {
          // Update existing product
          const updated = await prisma.product.update({
            where: { id: existing.id },
            data: {
              price: product.price,
              imageUrl: product.imageUrl || existing.imageUrl,
              description: product.description || existing.description,
              mouserUrl: product.mouserUrl,
            },
          })
          imported.push(updated)
        } else {
          // Create new product
          const created = await prisma.product.create({
            data: product,
          })
          imported.push(created)
        }
      } catch (error: any) {
        console.error(`Error importing product ${product.partNumber}:`, error)
        errors.push({ partNumber: product.partNumber, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      products: imported,
      errorDetails: errors,
      message: `Successfully imported ${imported.length} product(s)`,
    })
  } catch (error: any) {
    console.error('Error scraping Mouser:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to scrape products', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    )
  }
}

async function scrapeMouserProducts(url: string, limit: number = 10) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.mouser.com/',
      },
      timeout: 30000,
    })

    const $ = cheerio.load(response.data)
    const products: any[] = []

    // Multiple selectors to try for product listings
    const selectors = [
      'tr[data-partnumber]',
      '.SearchResultsRow',
      '.product-row',
      '.product-item',
      '[data-product-id]',
      'table tbody tr',
    ]

    let foundProducts = false

    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        foundProducts = true
        elements.slice(0, limit).each((index, element) => {
          try {
            const $el = $(element)
            
            // Extract part number - try multiple methods
            let partNumber = $el.find('.mfr-part-num, .part-number, [data-part-number], .partNum').first().text().trim() ||
                            $el.attr('data-partnumber') ||
                            $el.find('td').eq(1).text().trim() ||
                            $el.find('a[href*="/ProductDetail/"]').first().text().trim()

            // Extract manufacturer
            let manufacturer = $el.find('.mfr-name, .manufacturer, [data-manufacturer], .mfr').first().text().trim() ||
                              $el.find('.brand').first().text().trim() ||
                              $el.find('td').eq(0).text().trim()

            // Extract description
            let description = $el.find('.description, .product-description, [data-description], .desc').first().text().trim() ||
                            $el.find('h3, h4, .product-title').first().text().trim() ||
                            $el.find('td').eq(2).text().trim()

            // Extract price - try multiple formats
            let priceText = $el.find('.price, .pricing, [data-price], .unit-price').first().text().trim() ||
                           $el.find('.cost, .price-break').first().text().trim() ||
                           $el.find('td').last().text().trim()
            
            // Extract price from text (handle formats like "$1.23", "1.23", "USD 1.23", etc.)
            const priceMatch = priceText.match(/[\d,]+\.?\d*/)
            const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0

            // Extract image
            let imageUrl = $el.find('img').first().attr('src') || 
                          $el.find('img').first().attr('data-src') ||
                          $el.find('img').first().attr('data-lazy-src') || ''
            
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `https://www.mouser.com${imageUrl}`
            }

            // Extract product URL
            let productUrl = $el.find('a[href*="/ProductDetail/"]').first().attr('href') ||
                           $el.find('a').first().attr('href') || ''
            
            const fullUrl = productUrl.startsWith('http') 
              ? productUrl 
              : productUrl 
                ? `https://www.mouser.com${productUrl}`
                : null

            // Determine category from description
            let category = 'Semiconductor'
            if (description) {
              const descLower = description.toLowerCase()
              if (descLower.includes('resistor')) category = 'Resistor'
              else if (descLower.includes('capacitor')) category = 'Capacitor'
              else if (descLower.includes('transistor')) category = 'Transistor'
              else if (descLower.includes('diode')) category = 'Diode'
              else if (descLower.includes('ic') || descLower.includes('integrated circuit')) category = 'Integrated Circuit'
              else if (descLower.includes('microcontroller') || descLower.includes('mcu')) category = 'Microcontroller'
            }

            // Clean up extracted data
            partNumber = partNumber.replace(/\s+/g, ' ').trim()
            manufacturer = manufacturer.replace(/\s+/g, ' ').trim()
            description = description.replace(/\s+/g, ' ').trim()

            if (partNumber && manufacturer && partNumber.length > 0 && manufacturer.length > 0) {
              products.push({
                partNumber,
                manufacturer,
                description: description || `${manufacturer} ${partNumber}`,
                category,
                price: price || 0,
                stock: 0,
                imageUrl: imageUrl || null,
                mouserUrl: fullUrl,
              })
            }
          } catch (err) {
            console.error('Error parsing product:', err)
          }
        })
        break
      }
    }

    // If still no products found, try a more aggressive approach
    if (!foundProducts || products.length === 0) {
      $('tr, .row, [class*="product"]').each((index, element) => {
        if (products.length >= limit) return false
        
        const $el = $(element)
        const text = $el.text()
        
        // Look for patterns that suggest product data
        if (text.length > 20 && text.length < 500) {
          const links = $el.find('a[href*="/ProductDetail/"]')
          if (links.length > 0) {
            const partNumber = links.first().text().trim() || `AUTO-${Date.now()}-${index}`
            const manufacturer = $el.find('td, .cell').first().text().trim() || 'Unknown'
            
            if (partNumber && manufacturer && partNumber !== 'AUTO') {
              products.push({
                partNumber,
                manufacturer,
                description: text.substring(0, 200).trim() || `${manufacturer} ${partNumber}`,
                category: 'Semiconductor',
                price: 0,
                stock: 0,
                imageUrl: null,
                mouserUrl: links.first().attr('href') 
                  ? `https://www.mouser.com${links.first().attr('href')}`
                  : null,
              })
            }
          }
        }
      })
    }

    // Log what we found for debugging
    if (products.length === 0) {
      console.log('No products found. Page structure may have changed.')
      console.log('Page title:', $('title').text())
      console.log('Page has', $('tr').length, 'table rows')
      console.log('Page has', $('[class*="product"]').length, 'elements with "product" in class')
    } else {
      console.log(`Found ${products.length} products`)
    }

    return products
  } catch (error: any) {
    console.error('Error fetching Mouser page:', error.message)
    console.error('Error details:', error)
    
    // Return empty array instead of throwing to allow graceful handling
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new Error('Unable to connect to Mouser.com. Please check your internet connection.')
    } else if (error.response?.status === 403) {
      throw new Error('Access denied by Mouser.com. The website may be blocking automated requests.')
    } else if (error.response?.status === 404) {
      throw new Error('Page not found. Please check the URL.')
    } else {
      throw new Error(`Failed to fetch page: ${error.message}`)
    }
  }
}

