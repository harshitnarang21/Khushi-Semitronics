'use client'

import { useState } from 'react'

export default function BulkImporter({
  onImportComplete,
}: {
  onImportComplete: () => void
}) {
  const [searchTerms, setSearchTerms] = useState('semiconductor,resistor,capacitor,transistor,diode,IC,microcontroller')
  const [productsPerTerm, setProductsPerTerm] = useState(100)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<any>(null)
  const [error, setError] = useState('')

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setProgress(null)

    const terms = searchTerms.split(',').map(t => t.trim()).filter(t => t.length > 0)

    if (terms.length === 0) {
      setError('Please enter at least one search term')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/bulk-import-mouser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: terms,
          productsPerTerm,
          delay: 2000, // 2 seconds between requests
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to bulk import products')
      }

      setProgress(data)
      onImportComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bulk Import from Mouser</h2>
      <p className="text-gray-600 mb-6">
        Import products from Mouser.com in bulk by searching for multiple terms.
        This will import products from multiple categories automatically.
      </p>

      <form onSubmit={handleBulkImport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Terms (comma-separated) *
          </label>
          <input
            type="text"
            required
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            placeholder="semiconductor,resistor,capacitor"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter search terms separated by commas. Each term will be searched on Mouser.com
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Products Per Search Term
          </label>
          <input
            type="number"
            min="10"
            max="500"
            value={productsPerTerm}
            onChange={(e) => setProductsPerTerm(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Number of products to import per search term (10-500). Higher numbers take longer.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {progress && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">Bulk Import Complete!</p>
            <p className="mt-2">Total Imported: {progress.totalImported} products</p>
            {progress.totalErrors > 0 && (
              <p className="text-yellow-700">Errors: {progress.totalErrors} products</p>
            )}
            <div className="mt-4">
              <p className="font-semibold">Results by Term:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {progress.termResults.map((result: any, index: number) => (
                  <li key={index}>
                    {result.term}: {result.imported} products imported
                    {result.error && <span className="text-red-600"> - Error: {result.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p className="font-semibold mb-2">⚠️ Important Notes:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>This process may take several minutes depending on the number of products</li>
            <li>There is a 2-second delay between requests to avoid rate limiting</li>
            <li>Some products may fail to import due to parsing issues</li>
            <li>Mouser.com's HTML structure may change, affecting the scraper</li>
            <li>Products are automatically deduplicated by part number</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing Products... (This may take a while)' : 'Start Bulk Import'}
        </button>
      </form>
    </div>
  )
}

