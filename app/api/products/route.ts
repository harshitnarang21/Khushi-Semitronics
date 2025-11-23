import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { partNumber: { contains: search } },
        { manufacturer: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (category) {
      where.category = category
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    // Return empty result instead of error to prevent frontend crashes
    return NextResponse.json({
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      partNumber,
      manufacturer,
      description,
      category,
      price,
      stock,
      imageUrl,
      datasheetUrl,
      mouserUrl,
    } = body

    if (!partNumber || !manufacturer || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        partNumber,
        manufacturer,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock || '0'),
        imageUrl,
        datasheetUrl,
        mouserUrl,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product with this part number already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

