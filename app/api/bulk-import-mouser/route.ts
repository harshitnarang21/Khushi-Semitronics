import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      searchTerms = ['semiconductor', 'resistor', 'capacitor', 'transistor', 'diode', 'IC', 'microcontroller'],
      productsPerTerm = 100,
      delay = 2000 // 2 seconds delay between requests
    } = body

    const results = {
      totalImported: 0,
      totalErrors: 0,
      termResults: [] as any[],
    }

    // Process each search term
    for (const term of searchTerms) {
      try {
        console.log(`Processing search term: ${term}`)
        
        // Search Mouser for this term
        const searchUrl = `https://www.mouser.com/Search/Refine?Keyword=${encodeURIComponent(term)}`
        
        // Import products from multiple pages
        let page = 1
        let importedThisTerm = 0
        let hasMorePages = true
        const maxPages = Math.ceil(productsPerTerm / 50) // Assuming 50 products per page

        while (hasMorePages && page <= maxPages && importedThisTerm < productsPerTerm) {
          const pageUrl = `${searchUrl}&P=${page}`
          console.log(`Scraping page ${page} for term: ${term}`)
          
          const products = await scrapeMouserProducts(pageUrl, Math.min(50, productsPerTerm - importedThisTerm))
          
          if (products.length === 0) {
            hasMorePages = false
            break
          }

          // Import products
          for (const product of products) {
            try {
              const existing = await prisma.product.findUnique({
                where: { partNumber: product.partNumber },
              })

              if (existing) {
                await prisma.product.update({
                  where: { id: existing.id },
                  data: {
                    price: product.price,
                    imageUrl: product.imageUrl || existing.imageUrl,
                    description: product.description || existing.description,
                    mouserUrl: product.mouserUrl,
                    category: product.category || existing.category,
                  },
                })
              } else {
                await prisma.product.create({
                  data: product,
                })
              }
              importedThisTerm++
              results.totalImported++
            } catch (error: any) {
              results.totalErrors++
              console.error(`Error importing product ${product.partNumber}:`, error.message)
            }
          }

          // Delay between pages to avoid rate limiting
          if (hasMorePages && page < maxPages) {
            await new Promise(resolve => setTimeout(resolve, delay))
          }
          
          page++
        }

        results.termResults.push({
          term,
          imported: importedThisTerm,
        })

        // Delay between search terms
        if (searchTerms.indexOf(term) < searchTerms.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      } catch (error: any) {
        console.error(`Error processing term ${term}:`, error)
        results.termResults.push({
          term,
          imported: 0,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error: any) {
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { error: 'Failed to bulk import products', details: error.message },
      { status: 500 }
    )
  }
}

async function scrapeMouserProducts(url: string, limit: number = 50) {
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

            // Determine category from search term or description
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
            console.error('Error parsing product element:', err)
          }
        })
        break
      }
    }

    // If still no products found, try a more aggressive approach
    if (!foundProducts || products.length === 0) {
      // Try to find any table rows or divs that might contain product info
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

    return products.slice(0, limit)
  } catch (error: any) {
    console.error('Error fetching Mouser page:', error.message)
    // Return empty array instead of throwing to allow batch processing to continue
    return []
  }
}

