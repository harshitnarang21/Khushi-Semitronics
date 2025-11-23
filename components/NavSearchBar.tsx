'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function NavSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery)
      }, 300) // Debounce search

      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setIsExpanded(false)
    }
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      const data = await res.json()
      setResults(data.products || [])
      setIsExpanded(data.products && data.products.length > 0)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
      setIsExpanded(false)
      setSearchQuery('')
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    setIsExpanded(false)
    setSearchQuery('')
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-lg mx-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsExpanded(true)
          }}
          className="w-full px-4 py-2.5 pl-10 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm transition-all"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isExpanded && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.partNumber}
                      className="w-12 h-12 object-contain flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.partNumber}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.manufacturer}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {product.description}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary-600 mt-1">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={handleSubmit}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-2 text-center"
              >
                View all results →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

