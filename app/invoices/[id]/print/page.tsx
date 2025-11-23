'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Logo from '@/components/Logo'

interface InvoiceItem {
  id: string
  partNumber: string
  description: string | null
  quantity: number
  unitPrice: number
  total: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  customerName: string
  customerAddress: string | null
  customerPhone: string | null
  customerEmail: string | null
  customerGST: string | null
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string | null
  terms: string | null
  status: string
  items: InvoiceItem[]
}

export default function InvoicePrintPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string)
    }
    // Auto print when page loads
    window.addEventListener('load', () => window.print())
  }, [params.id])

  const fetchInvoice = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/invoices/${id}`)
      if (!res.ok) {
        throw new Error('Invoice not found')
      }
      const data = await res.json()
      setInvoice(data)
      // Trigger print after a short delay
      setTimeout(() => window.print(), 500)
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Invoice */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 print:p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 flex-shrink-0 bg-white rounded-lg p-2 flex items-center justify-center print:h-12 print:w-12">
                <Logo className="h-full w-full" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 print:text-2xl">KHUSHI SEMITRONICS</h1>
                <p className="text-blue-100 text-sm">Independent Distributor of Electronic Components</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 print:p-3">
                <p className="text-xs text-blue-100 mb-1">Invoice Number</p>
                <p className="text-xl font-bold print:text-lg">{invoice.invoiceNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="p-6 print:p-4 border-b-2 border-gray-300">
          <div className="grid grid-cols-2 gap-6 print:gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">From:</h3>
              <p className="font-bold text-lg print:text-base">KHUSHI SEMITRONICS</p>
              <p className="text-gray-600 text-sm">G-93 Dilshad Colony</p>
              <p className="text-gray-600 text-sm">Delhi-95, India</p>
              <p className="text-gray-600 text-sm mt-2">Phone: +91-9560426627</p>
              <p className="text-gray-600 text-sm">Email: khushi.semitronics@yahoo.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">To:</h3>
              <p className="font-bold text-lg print:text-base">{invoice.customerName}</p>
              {invoice.customerAddress && (
                <p className="text-gray-600 text-sm">{invoice.customerAddress}</p>
              )}
              {invoice.customerPhone && (
                <p className="text-gray-600 text-sm">Phone: {invoice.customerPhone}</p>
              )}
              {invoice.customerEmail && (
                <p className="text-gray-600 text-sm">Email: {invoice.customerEmail}</p>
              )}
              {invoice.customerGST && (
                <p className="text-gray-600 text-sm">GST: {invoice.customerGST}</p>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-600">Invoice Date:</p>
                <p className="font-semibold text-sm">
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 print:p-4">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  S.No
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Part Number
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border border-gray-300">
                  Description
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Qty
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Unit Price
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border border-gray-300">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 border border-gray-300">
                    {item.partNumber}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 border border-gray-300">
                    {item.description || '-'}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right border border-gray-300">
                    ₹{item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right border border-gray-300">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6 print:p-4 bg-gray-50 border-t-2 border-gray-300">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-400">
                <span>Total Amount:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="p-6 print:p-4 border-t-2 border-gray-300 bg-gray-50">
            {invoice.notes && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Notes:</h3>
                <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Terms & Conditions:</h3>
                <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 print:p-4 bg-blue-600 text-white text-center text-sm print:text-xs">
          <p>Thank you for your business!</p>
          <p className="mt-1">KHUSHI SEMITRONICS - G-93 Dilshad Colony, Delhi-95</p>
        </div>
      </div>
    </div>
  )
}

