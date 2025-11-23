'use client'

import { useState, useEffect } from 'react'

export default function Logo({ className = 'h-12 w-12' }: { className?: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Check if image exists
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageError(true)
    img.src = '/images/logo.png'
  }, [])

  if (imageError || !imageLoaded) {
    // Fallback: Show initials "KS" in a styled box matching the logo design
    return (
      <div className={`flex-shrink-0 ${className} bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-xl">KS</span>
      </div>
    )
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <img
        src="/images/logo.png"
        alt="Khushi Semitronics Logo"
        className="h-full w-full object-contain"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}

