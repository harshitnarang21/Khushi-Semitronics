# Vercel Deployment Setup Guide

## Database Initialization

After your site is deployed, you need to initialize the database schema to create the tables.

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
cd /path/to/Khushi-Semitronics
vercel link
```

4. Pull environment variables:
```bash
vercel env pull .env.local
```

5. Push database schema:
```bash
npx prisma db push
```

### Method 2: Using API Endpoint

After deployment, you can initialize the database by making a POST request to:
```
https://your-site.vercel.app/api/setup
```

You can use curl:
```bash
curl -X POST https://your-site.vercel.app/api/setup
```

Or use a tool like Postman or visit the endpoint in your browser (though POST might not work from browser directly).

### Method 3: Check Database Status

To check if your database is ready, visit:
```
https://your-site.vercel.app/api/setup
```
(GET request - this will show database connection status)

## After Database is Initialized

1. Add sample products (optional):
   - Go to Admin panel
   - Use "Add Product" or "Import from Mouser"
   - Or run `npm run seed` locally if you have DATABASE_URL set

2. Your site should now be fully functional!

