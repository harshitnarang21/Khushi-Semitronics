import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Push the schema to create tables
    const { execSync } = require('child_process')
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database schema initialized successfully' 
    })
  } catch (error: any) {
    console.error('Error setting up database:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to query a table to see if it exists
    const productCount = await prisma.product.count().catch(() => 0)
    
    return NextResponse.json({ 
      connected: true,
      tablesExist: productCount >= 0,
      message: 'Database is ready' 
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        connected: false,
        error: error.message 
      },
      { status: 500 }
    )
  }
}

