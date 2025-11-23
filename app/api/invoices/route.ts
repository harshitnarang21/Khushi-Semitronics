import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Ensure Prisma is initialized
    if (!prisma) {
      console.error('Prisma client is not initialized')
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: limit,
        orderBy: { invoiceDate: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.invoice.count(),
    ])

    return NextResponse.json({
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

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
    const {
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
      customerGST,
      items,
      taxRate = 18.0,
      notes,
      terms,
    } = body

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of items) {
      if (!item.partNumber || !item.description) {
        return NextResponse.json(
          { error: 'All items must have part number and description' },
          { status: 400 }
        )
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'All items must have quantity greater than 0' },
          { status: 400 }
        )
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        return NextResponse.json(
          { error: 'All items must have a valid unit price' },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      const qty = parseInt(item.quantity) || 0
      const price = parseFloat(item.unitPrice) || 0
      return sum + (qty * price)
    }, 0)
    const finalTaxRate = parseFloat(taxRate) || 18.0
    const taxAmount = (subtotal * finalTaxRate) / 100
    const total = subtotal + taxAmount

    // Generate invoice number
    const year = new Date().getFullYear()
    // SQLite doesn't support startsWith, so we'll get all invoices and filter
    const allInvoices = await prisma.invoice.findMany({
      select: { invoiceNumber: true },
    })
    const yearInvoices = allInvoices.filter(inv => inv.invoiceNumber.startsWith(`INV-${year}-`))
    const count = yearInvoices.length
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName,
        customerAddress,
        customerPhone,
        customerEmail,
        customerGST,
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxRate: finalTaxRate,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        notes,
        terms,
        items: {
          create: items.map((item: any) => {
            const qty = parseInt(item.quantity) || 0
            const price = parseFloat(item.unitPrice) || 0
            return {
              productId: item.productId || null,
              partNumber: String(item.partNumber).trim(),
              description: String(item.description || '').trim(),
              quantity: qty,
              unitPrice: parseFloat(price.toFixed(2)),
              total: parseFloat((qty * price).toFixed(2)),
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error: any) {
    console.error('Error creating invoice:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    // Check if prisma is undefined
    if (!prisma) {
      console.error('Prisma client is undefined!')
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please restart the server.',
          details: 'Prisma client not initialized',
        },
        { status: 500 }
      )
    }
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create invoice'
    if (error.code === 'P2002') {
      errorMessage = 'Invoice number already exists. Please try again.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    )
  }
}

