# Khushi-Semitronics

E-commerce website for Khushi Semitronics - A professional semiconductor components store built with Next.js, TypeScript, and Prisma.

## Features

- 🛍️ **Product Catalog**: Browse and search through a wide range of semiconductor components
- 📦 **Product Management**: Admin panel to add, update, and manage products
- 📄 **Invoice Generation**: Create and manage professional invoices
- 🔍 **Advanced Search**: Search products by part number, manufacturer, or description
- 📱 **WhatsApp Integration**: Join WhatsApp group for orders and updates
- 🎨 **Modern UI**: Clean, professional design inspired by Mouser.com
- 📊 **Stock Management**: Track inventory and stock levels
- 🖼️ **Image Upload**: Upload and manage product images
- 🔄 **Bulk Import**: Import products from Mouser.com

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Deployment**: Ready for Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/harshitnarang21/Khushi-Semitronics.git
cd Khushi-Semitronics
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma db push
```

4. Add sample products (optional)
```bash
npm run seed
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── invoices/          # Invoice pages
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## Environment Variables

### Local Development

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

### Vercel Deployment

1. **Add Vercel Postgres Database**:
   - Go to your Vercel project dashboard
   - Click on "Storage" tab
   - Click "Create" → "Postgres"
   - Create the database (free tier available)
   - Copy the connection string

2. **Set Environment Variable**:
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` with your Postgres connection string
   - Make sure to select all environments (Production, Preview, Development)

3. **Deploy**:
   - Vercel will automatically run `prisma generate` and `prisma db push` during build
   - Your database schema will be created automatically

**Note**: The project is configured to use PostgreSQL for production (Vercel) and SQLite for local development. The Prisma schema will automatically use the correct database based on the `DATABASE_URL` environment variable.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Add sample products
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## Contact

- **Email**: khushi.semitronics@yahoo.com
- **Phone**: +91-9560426627
- **Address**: G-93 Dilshad Colony, Delhi-95, India
- **WhatsApp**: [Join our group](https://chat.whatsapp.com/DFPdGU6I4ZSJuqfh6DkVVe)

## License

This project is private and proprietary.
