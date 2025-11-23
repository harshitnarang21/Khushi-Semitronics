'use client'

interface Product {
  id: string
  partNumber: string
  manufacturer: string
  description: string | null
  category: string | null
  price: number
  stock: number
  imageUrl: string | null
  datasheetUrl: string | null
  mouserUrl: string | null
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card group overflow-hidden">
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.partNumber}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {product.category}
            </span>
          </div>
        )}
        {product.stock > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
              In Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1.5 group-hover:text-primary-600 transition-colors">
          {product.partNumber}
        </h3>
        <p className="text-sm font-medium text-gray-600 mb-3">{product.manufacturer}</p>
        {product.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        )}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Stock</p>
            <span
              className={`text-sm font-semibold ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
            </span>
          </div>
        </div>
        {product.mouserUrl && (
          <a
            href={product.mouserUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-primary-50 text-primary-600 text-sm font-medium rounded-lg transition-colors group/link"
          >
            View on Mouser
            <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

