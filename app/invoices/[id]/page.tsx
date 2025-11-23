'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function InvoiceViewPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string)
    }
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
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h3>
          <p className="text-gray-600 mb-6">The invoice you&apos;re looking for doesn&apos;t exist</p>
          <Link href="/invoices" className="btn-primary inline-block">
            Back to Invoices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Buttons - Hidden when printing */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link
            href="/invoices"
            className="text-primary-600 hover:text-primary-800 font-medium transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Invoices
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save as PDF
            </button>
            <Link
              href={`/invoices/${invoice.id}/print`}
              target="_blank"
              className="btn-secondary"
            >
              Open Print View
            </Link>
          </div>
        </div>

        {/* Invoice */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 flex-shrink-0 bg-white rounded-lg p-2 flex items-center justify-center">
                  <Logo className="h-full w-full" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">KHUSHI SEMITRONICS</h1>
                  <p className="text-blue-100">Independent Distributor of Electronic Components</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-blue-100 mb-1">Invoice Number</p>
                  <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
                <p className="font-bold text-lg">KHUSHI SEMITRONICS</p>
                <p className="text-gray-600">G-93 Dilshad Colony</p>
                <p className="text-gray-600">Delhi-95, India</p>
                <p className="text-gray-600 mt-2">Phone: +91-9560426627</p>
                <p className="text-gray-600">Email: khushi.semitronics@yahoo.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">To:</h3>
                <p className="font-bold text-lg">{invoice.customerName}</p>
                {invoice.customerAddress && (
                  <p className="text-gray-600">{invoice.customerAddress}</p>
                )}
                {invoice.customerPhone && (
                  <p className="text-gray-600">Phone: {invoice.customerPhone}</p>
                )}
                {invoice.customerEmail && (
                  <p className="text-gray-600">Email: {invoice.customerEmail}</p>
                )}
                {invoice.customerGST && (
                  <p className="text-gray-600">GST: {invoice.customerGST}</p>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Invoice Date:</p>
                  <p className="font-semibold">
                    {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Part Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.partNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.description || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      ₹{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
                  <span>Total Amount:</span>
                  <span>₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {invoice.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Notes:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Terms & Conditions:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center text-sm">
            <p className="font-semibold">Thank you for your business!</p>
            <p className="mt-1 text-primary-100">KHUSHI SEMITRONICS - G-93 Dilshad Colony, Delhi-95</p>
          </div>
        </div>
      </div>
    </div>
  )
}

