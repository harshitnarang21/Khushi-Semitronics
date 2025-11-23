/**
 * Bulk Import Script
 * Run this script to import products from Mouser.com in bulk
 * 
 * Usage: npx tsx scripts/bulk-import.ts
 */

import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as cheerio from 'cheerio'

const prisma = new PrismaClient()

// Common semiconductor search terms
const SEARCH_TERMS = [
  'semiconductor',
  'resistor',
  'capacitor',
  'transistor',
  'diode',
  'IC',
  'microcontroller',
  'op-amp',
  'voltage regulator',
  'oscillator',
  'crystal',
  'connector',
  'LED',
  'switch',
  'relay',
]

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

    // Try multiple selectors
    const selectors = [
      'tr[data-partnumber]',
      '.SearchResultsRow',
      '.product-row',
      '.product-item',
      '[data-product-id]',
      'table tbody tr',
    ]

    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        elements.slice(0, limit).each((index, element) => {
          try {
            const $el = $(element)
            
            let partNumber = $el.find('.mfr-part-num, .part-number, [data-part-number], .partNum').first().text().trim() ||
                            $el.attr('data-partnumber') ||
                            $el.find('td').eq(1).text().trim() ||
                            $el.find('a[href*="/ProductDetail/"]').first().text().trim()

            let manufacturer = $el.find('.mfr-name, .manufacturer, [data-manufacturer], .mfr').first().text().trim() ||
                              $el.find('.brand').first().text().trim() ||
                              $el.find('td').eq(0).text().trim()

            let description = $el.find('.description, .product-description, [data-description], .desc').first().text().trim() ||
                            $el.find('h3, h4, .product-title').first().text().trim() ||
                            $el.find('td').eq(2).text().trim()

            let priceText = $el.find('.price, .pricing, [data-price], .unit-price').first().text().trim() ||
                           $el.find('.cost, .price-break').first().text().trim() ||
                           $el.find('td').last().text().trim()
            
            const priceMatch = priceText.match(/[\d,]+\.?\d*/)
            const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0

            let imageUrl = $el.find('img').first().attr('src') || 
                          $el.find('img').first().attr('data-src') ||
                          $el.find('img').first().attr('data-lazy-src') || ''
            
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `https://www.mouser.com${imageUrl}`
            }

            let productUrl = $el.find('a[href*="/ProductDetail/"]').first().attr('href') ||
                           $el.find('a').first().attr('href') || ''
            
            const fullUrl = productUrl.startsWith('http') 
              ? productUrl 
              : productUrl 
                ? `https://www.mouser.com${productUrl}`
                : null

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
            // Skip invalid products
          }
        })
        break
      }
    }

    return products.slice(0, limit)
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error.message)
    return []
  }
}

async function bulkImport() {
  const productsPerTerm = 100
  const delay = 2000 // 2 seconds between requests
  let totalImported = 0
  let totalErrors = 0

  console.log('Starting bulk import from Mouser.com...')
  console.log(`Search terms: ${SEARCH_TERMS.join(', ')}`)
  console.log(`Products per term: ${productsPerTerm}`)
  console.log('---\n')

  for (const term of SEARCH_TERMS) {
    try {
      console.log(`Processing: ${term}`)
      const searchUrl = `https://www.mouser.com/Search/Refine?Keyword=${encodeURIComponent(term)}`
      
      let page = 1
      let importedThisTerm = 0
      const maxPages = Math.ceil(productsPerTerm / 50)

      while (page <= maxPages && importedThisTerm < productsPerTerm) {
        const pageUrl = `${searchUrl}&P=${page}`
        console.log(`  Page ${page}...`)
        
        const products = await scrapeMouserProducts(pageUrl, Math.min(50, productsPerTerm - importedThisTerm))
        
        if (products.length === 0) {
          console.log(`  No more products found for ${term}`)
          break
        }

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
            totalImported++
          } catch (error: any) {
            totalErrors++
            console.error(`    Error importing ${product.partNumber}: ${error.message}`)
          }
        }

        console.log(`  Imported ${importedThisTerm} products so far for ${term}`)
        
        if (page < maxPages) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        page++
      }

      console.log(`✓ Completed ${term}: ${importedThisTerm} products imported\n`)
      
      // Delay between search terms
      if (SEARCH_TERMS.indexOf(term) < SEARCH_TERMS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    } catch (error: any) {
      console.error(`✗ Error processing ${term}: ${error.message}\n`)
    }
  }

  console.log('---')
  console.log(`Bulk import complete!`)
  console.log(`Total imported: ${totalImported} products`)
  console.log(`Total errors: ${totalErrors}`)
}

// Run the import
bulkImport()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

