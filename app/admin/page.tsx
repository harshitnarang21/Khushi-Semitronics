'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductForm from '@/components/ProductForm'
import ProductList from '@/components/ProductList'
import MouserImporter from '@/components/MouserImporter'
import BulkImporter from '@/components/BulkImporter'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'import' | 'bulk'>('list')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleProductAdded = () => {
    setRefreshKey((k) => k + 1)
    setActiveTab('list')
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-100">Manage your inventory and products</p>
            </div>
            <Link
              href="/invoices/new"
              className="btn-secondary bg-white text-primary-600 hover:bg-primary-50 hidden sm:inline-flex"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Create Invoice
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'list'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'add'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Add Product
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'import'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Import from Mouser
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'bulk'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Bulk Import
              </button>
            </nav>
          </div>
        </div>

        <div className="card p-8">
          {activeTab === 'list' && (
            <ProductList key={refreshKey} onProductUpdated={handleProductAdded} />
          )}
          {activeTab === 'add' && (
            <ProductForm onSuccess={handleProductAdded} />
          )}
          {activeTab === 'import' && (
            <MouserImporter onImportComplete={handleProductAdded} />
          )}
          {activeTab === 'bulk' && (
            <BulkImporter onImportComplete={handleProductAdded} />
          )}
        </div>
      </div>
    </div>
  )
}

