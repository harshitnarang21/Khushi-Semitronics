'use client'

import { useState } from 'react'

export default function MouserImporter({
  onImportComplete,
}: {
  onImportComplete: () => void
}) {
  const [url, setUrl] = useState('')
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/scrape-mouser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, limit }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to import products')
      }

      // Check if any products were actually imported
      if (data.imported === 0 && data.products && data.products.length === 0) {
        setError(data.message || 'No products were found or imported. The scraper may not be able to parse the Mouser.com page structure. Try a different URL or add products manually.')
      } else {
        setResult(data)
        onImportComplete()
      }
    } catch (err: any) {
      console.error('Import error:', err)
      setError(err.message || 'Failed to import products. Please check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Import Products from Mouser</h2>
      <p className="text-gray-600 mb-6">
        Enter a Mouser.com search URL or product listing page URL to import
        products. The scraper will attempt to extract product information and
        add it to your inventory.
      </p>

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mouser URL *
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.mouser.com/Search/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Example: https://www.mouser.com/Search/Refine?Keyword=arduino
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Products to Import
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">Import Complete!</p>
            <p>Imported: {result.imported} products</p>
            {result.errors > 0 && (
              <p className="text-yellow-700">
                Errors: {result.errors} products
              </p>
            )}
            {result.message && (
              <p className="text-sm mt-2">{result.message}</p>
            )}
            {result.errorDetails && result.errorDetails.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-semibold">Error Details</summary>
                <ul className="list-disc list-inside mt-1 text-xs">
                  {result.errorDetails.map((err: any, idx: number) => (
                    <li key={idx}>{err.partNumber}: {err.error}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Import Products'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-900 mb-2">Note:</h3>
        <p className="text-sm text-blue-800">
          Web scraping may not always work perfectly due to website structure
          changes. If the automatic import fails, you can manually add products
          using the &quot;Add Product&quot; tab. The scraper attempts to extract part
          numbers, manufacturers, descriptions, prices, and images from Mouser
          product pages.
        </p>
      </div>
    </div>
  )
}

