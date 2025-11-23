import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import NavSearchBar from '@/components/NavSearchBar'
import Logo from '@/components/Logo'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Khushi Semitronics - Semiconductor Components',
  description: 'Your trusted source for semiconductor components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center space-x-3">
                  <Logo />
                  <span className="text-xl font-bold text-gray-900 hidden sm:block">
                    Khushi Semitronics
                  </span>
                </Link>
                <div className="hidden lg:ml-8 lg:flex lg:space-x-6">
                  <Link
                    href="/"
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/invoices"
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Invoices
                  </Link>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-lg mx-6">
                <NavSearchBar />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary-600 p-2"
                  aria-label="Search"
                >
                  <svg
                    className="h-6 w-6"
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
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <WhatsAppButton />
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20 border-t border-gray-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Khushi Semitronics</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your trusted source for premium semiconductor components and electronic parts.
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-gray-300">Office Address:</span><br />
                  G-93 Dilshad Colony<br />
                  Delhi-95, India
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/invoices" className="text-gray-400 hover:text-white transition-colors">
                      Invoices
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Email: khushi.semitronics@yahoo.com</li>
                  <li>Phone: +91-9560426627</li>
                </ul>
                <div className="mt-4">
                  <a
                    href="https://chat.whatsapp.com/DFPdGU6I4ZSJuqfh6DkVVe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>Join WhatsApp Group</span>
                  </a>
                  <p className="text-xs text-gray-500 mt-2">Get updates & place orders</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} Khushi Semitronics. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

