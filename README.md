# Khushi Semitronics - Semiconductor E-Commerce Platform

A modern e-commerce website for selling semiconductor components, similar to Mouser.com, with full inventory management capabilities.

## Features

- **Product Catalog**: Browse and search semiconductor products with filters
- **Admin Dashboard**: Complete CRUD operations for product management
- **Image Upload**: Upload and update product images
- **Stock Management**: Add, update, and remove stock quantities
- **Mouser Integration**: Import products from Mouser.com using web scraping
- **Modern UI**: Beautiful, responsive design built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Image Handling**: File uploads to public/uploads directory

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Create the uploads directory:
```bash
mkdir -p public/uploads
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Viewing Products

- Navigate to the home page to browse all products
- Use the search bar to find products by part number, manufacturer, or description
- Filter products by category using the category buttons

### Admin Features

1. **Access Admin Dashboard**: Click "Admin" in the navigation bar

2. **Add Product**:
   - Go to "Add Product" tab
   - Fill in product details (Part Number, Manufacturer, Price are required)
   - Upload an image file or provide an image URL
   - Click "Add Product"

3. **Edit Product**:
   - Go to "Manage Products" tab
   - Click "Edit" on any product
   - Update the information and click "Update Product"

4. **Delete Product**:
   - Go to "Manage Products" tab
   - Click "Delete" on any product
   - Confirm the deletion

5. **Update Stock**:
   - Edit a product and change the stock quantity
   - Save the changes

6. **Update Product Image**:
   - Edit a product
   - Upload a new image file or change the image URL
   - Save the changes

7. **Import from Mouser**:
   - Go to "Import from Mouser" tab
   - Enter a Mouser.com search URL or product listing URL
   - Set the number of products to import
   - Click "Import Products"

8. **Bulk Import from Mouser**:
   - Go to "Bulk Import" tab in Admin
   - Enter multiple search terms separated by commas (e.g., "semiconductor,resistor,capacitor")
   - Set the number of products to import per term
   - Click "Start Bulk Import"
   - This will automatically import products from multiple categories

9. **Bulk Import via Command Line**:
   - Run `npm run bulk-import` to import products from common semiconductor categories
   - This script will import products from 15+ categories automatically
   - Products are imported with a 2-second delay between requests to avoid rate limiting

## Database Management

- View database: `npx prisma studio`
- Reset database: Delete `prisma/dev.db` and run `npx prisma db push`

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── products/     # Product CRUD endpoints
│   │   ├── upload/       # Image upload endpoint
│   │   ├── scrape-mouser/# Mouser scraper endpoint
│   │   └── categories/   # Categories endpoint
│   ├── admin/            # Admin dashboard page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── MouserImporter.tsx
│   └── BulkImporter.tsx
├── scripts/
│   └── bulk-import.ts    # Command-line bulk import script
├── lib/
│   └── prisma.ts         # Prisma client
├── prisma/
│   └── schema.prisma     # Database schema
└── public/
    └── uploads/          # Uploaded images
```

## Bulk Importing Products

The website includes two methods to bulk import products from Mouser.com:

### Method 1: Web Interface (Recommended)
1. Go to Admin → "Bulk Import" tab
2. Enter search terms (comma-separated)
3. Set products per term (10-500)
4. Click "Start Bulk Import"

### Method 2: Command Line Script
Run the automated bulk import script:
```bash
npm run bulk-import
```

This will import products from 15+ common semiconductor categories:
- Semiconductors, Resistors, Capacitors, Transistors, Diodes
- ICs, Microcontrollers, Op-amps, Voltage Regulators
- Oscillators, Crystals, Connectors, LEDs, Switches, Relays

The script imports 100 products per category by default (configurable in the script).

## Notes

- The Mouser scraper may require adjustments based on Mouser.com's current HTML structure
- Bulk imports include a 2-second delay between requests to avoid rate limiting
- Products are automatically deduplicated by part number
- Some products may fail to import due to parsing issues or website structure changes
- For production, consider using a more robust database (PostgreSQL) and cloud storage for images
- Add authentication/authorization for the admin panel in production
- Be respectful of Mouser.com's servers when bulk importing

## License

MIT

