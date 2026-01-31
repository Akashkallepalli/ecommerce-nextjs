# E-Commerce Catalog with Next.js, Server-Side Rendering, and NextAuth.js

A full-stack e-commerce platform built with Next.js 12+, featuring server-side rendering (SSR), user authentication with NextAuth.js and GitHub OAuth, shopping cart functionality, and containerized deployment with Docker.

## Features

✅ **Server-Side Rendering (SSR)**: Fresh data on every request for dynamic product listings
✅ **NextAuth.js Authentication**: Secure GitHub OAuth integration
✅ **Shopping Cart**: Protected API routes for cart management with full CRUD operations
✅ **Product Search**: Server-side search filtering on name and description
✅ **Pagination**: Product listing with page-based navigation
✅ **Responsive Design**: Mobile-first design with Tailwind CSS
✅ **Data Validation**: Zod schema validation for API requests
✅ **Docker Containerization**: Full dev/prod environment with docker-compose
✅ **Database**: PostgreSQL with Prisma ORM
✅ **Testing Ready**: data-testid attributes for automated testing

## Tech Stack

- **Frontend**: Next.js 12+, React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL 15, Prisma ORM
- **Authentication**: NextAuth.js, GitHub OAuth
- **Validation**: Zod
- **Data Fetching**: SWR
- **Containerization**: Docker, Docker Compose
- **Testing**: Playwright/Cypress ready with data-testid

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git
- GitHub OAuth App credentials (see setup)

## Quick Start with Docker

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/ecommerce-nextjs.git
cd ecommerce-nextjs
\`\`\`

### 2. Set Up Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your GitHub OAuth credentials:

\`\`\`env
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
\`\`\`

### 3. Run with Docker Compose

\`\`\`bash
docker-compose up
\`\`\`

The application will be available at `http://localhost:3000`

**First time setup** (docker-compose will handle this automatically):
- Database migrations
- Database seeding with sample products
- Prisma client generation

## Local Development (Without Docker)

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Set Up Database

\`\`\`bash
# Create PostgreSQL database locally or use a service
# Update DATABASE_URL in .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
\`\`\`

### 4. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App:
   - Application name: E-Commerce App
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
3. Copy Client ID and Client Secret to `.env.local`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/callback/[provider]` - OAuth callback
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/providers` - List providers

### Products
- `GET /api/products` (page, q params) - List products (via SSR on index.js)
- `GET /products/[id]` - Product detail page (SSR)

### Cart (Protected - Requires Authentication)
- `GET /api/cart` - Get user's cart (401 if not authenticated)
- `POST /api/cart` - Add item to cart
  - Body: \`{ productId: string, quantity: number }\`
- `PUT /api/cart` - Update item quantity
  - Body: \`{ productId: string, quantity: number }\`
- `DELETE /api/cart` - Remove item from cart
  - Body: \`{ productId: string }\`

## Pages

### Public Pages
- `/` - Product listing with search and pagination
- `/products/[id]` - Product detail
- `/auth/signin` - GitHub OAuth sign in
- `/auth/error` - Authentication error page

### Protected Pages
- `/cart` - Shopping cart (requires authentication, middleware redirects)

## Database Schema

### User (NextAuth)
- id (String, CUID)
- email (String, unique)
- name (String)
- image (String)
- emailVerified (DateTime)
- accounts (Account[])
- sessions (Session[])
- cart (Cart)

### Product
- id (String, CUID)
- name (String)
- description (String)
- price (Float)
- imageUrl (String)
- stock (Int)
- category (String)
- cartItems (CartItem[])

### Cart
- id (String, CUID)
- userId (String, unique, FK)
- user (User)
- items (CartItem[])

### CartItem
- id (String, CUID)
- quantity (Int)
- productId (String, FK)
- product (Product)
- cartId (String, FK)
- cart (Cart)

## Testing with data-testid

All interactive elements have data-testid attributes for testing:

### Product Listing Page (/)
- `search-input` - Search input field
- `search-button` - Search button
- `product-card-{productId}` - Product card container
- `add-to-cart-button-{productId}` - Add to cart button
- `pagination-next` - Next page button
- `pagination-prev` - Previous page button

### Product Detail Page (/products/[id])
- `product-name` - Product name display
- `product-price` - Product price display
- `product-description` - Product description
- `add-to-cart-button` - Add to cart button

### Cart Page (/cart)
- `cart-item-{productId}` - Cart item container
- `quantity-input-{productId}` - Quantity input
- `remove-item-button-{productId}` - Remove button
- `cart-total` - Cart total display

### Authentication
- `signin-button` - Sign in button
- `signout-button` - Sign out button

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - DATABASE_URL
   - NEXTAUTH_URL (your Vercel URL)
   - NEXTAUTH_SECRET
   - GITHUB_ID, GITHUB_SECRET
4. Deploy

### Update GitHub OAuth

Update the OAuth callback URL in GitHub:
- Authorization callback URL: `https://your-vercel-url.vercel.app/api/auth/callback/github`

## Project Structure

\`\`\`
ecommerce-nextjs/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js
│   │   └── cart/
│   │       └── index.js
│   ├── auth/
│   │   ├── signin.js
│   │   └── error.js
│   ├── products/
│   │   └── [id].js
│   └── index.js
├── components/
│   ├── Header.js
│   ├── ProductCard.js
│   ├── SearchBar.js
│   ├── CartItem.js
│   └── AddToCartButton.js
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── styles/
├── middleware.js
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── submission.json
├── next.config.js
├── package.json
└── README.md
\`\`\`

## Troubleshooting

### Database Connection Error

\`\`\`
Error: Can't reach database server at db:5432
\`\`\`

**Solution**: Ensure db service is healthy before app starts
\`\`\`bash
docker-compose down
docker-compose up
\`\`\`

### Prisma Client Generation Error

\`\`\`bash
npx prisma generate
\`\`\`

### Port Already in Use

Change port in docker-compose.yml:
\`\`\`yaml
ports:
  - '3001:3000'  # Change first port
\`\`\`

### Authentication Issues

1. Verify NEXTAUTH_SECRET is set (min 32 characters)
2. Check GitHub OAuth credentials
3. Verify NEXTAUTH_URL matches deployment URL

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:password@db:5432/ecommerce |
| NEXTAUTH_URL | Application URL | http://localhost:3000 |
| NEXTAUTH_SECRET | JWT signing secret (min 32 chars) | generated by openssl |
| GITHUB_ID | GitHub OAuth App ID | (from GitHub settings) |
| GITHUB_SECRET | GitHub OAuth App Secret | (from GitHub settings) |
| NODE_ENV | Environment | development/production |

## Security Notes

- Never commit `.env` files with secrets
- NEXTAUTH_SECRET should be a strong random string (32+ characters)
- Use environment variables for all sensitive data
- Protect cart API routes with authentication (middleware enforces this)
- Validate all input with Zod schemas

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly with data-testid attributes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and environment details

---

**Happy coding!** 🚀
