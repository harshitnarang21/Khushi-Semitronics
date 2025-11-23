import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    })

    const categoryList = categories
      .map((c) => c.category)
      .filter((c) => c !== null && c !== '') as string[]

    return NextResponse.json(categoryList)
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([])
  }
}

