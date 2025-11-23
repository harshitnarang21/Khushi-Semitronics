import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Initializing database...')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✓ Database connected')
    
    // Try to query products to see if table exists
    const count = await prisma.product.count()
    console.log(`✓ Database initialized. Found ${count} products.`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠ Database tables do not exist. Please run: npx prisma db push')
      console.log('Or visit: /api/setup (POST) to initialize the database')
    } else {
      console.error('Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

