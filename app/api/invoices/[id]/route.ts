import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
      customerGST,
      items,
      taxRate,
      notes,
      terms,
      status,
    } = body

    // If items are being updated, recalculate totals
    let updateData: any = {
      ...(customerName && { customerName }),
      ...(customerAddress !== undefined && { customerAddress }),
      ...(customerPhone !== undefined && { customerPhone }),
      ...(customerEmail !== undefined && { customerEmail }),
      ...(customerGST !== undefined && { customerGST }),
      ...(taxRate !== undefined && { taxRate }),
      ...(notes !== undefined && { notes }),
      ...(terms !== undefined && { terms }),
      ...(status && { status }),
    }

    if (items) {
      const subtotal = items.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.unitPrice)
      }, 0)
      const finalTaxRate = taxRate || 18.0
      const taxAmount = (subtotal * finalTaxRate) / 100
      const total = subtotal + taxAmount

      updateData.subtotal = subtotal
      updateData.taxAmount = taxAmount
      updateData.total = total
      updateData.taxRate = finalTaxRate

      // Delete existing items and create new ones
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      })

      updateData.items = {
        create: items.map((item: any) => ({
          productId: item.productId || null,
          partNumber: item.partNumber,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      }
    }

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Error updating invoice:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Invoice deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting invoice:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}

