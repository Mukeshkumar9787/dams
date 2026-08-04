# DAMS

DAMS is a full-stack e-commerce application with a customer storefront, checkout flow, and role-protected administration features.

## Features

- Product browsing with categories, sizes, colors, HSN/tax data, stock, search/filter views, and product details
- Cart and wishlist management, including persisted user data
- Checkout with saved addresses, billing details, shipping configuration, order notes, and shipping charges
- Razorpay online payments with payment verification and payment-failure handling
- Cash-on-delivery order type in the domain model
- Customer accounts with password authentication, email OTP login/registration/password reset, and Google sign-in
- Customer order history, order details, invoices, order status history, and dispute actions
- Product reviews, review visibility controls, and out-of-stock notification requests
- Admin dashboard with product, category, size, color, HSN, user, order, company-information, courier, and shipping configuration management
- Admin order status updates and role management
- Audit logging for API activity and audit-log statistics
- File uploads using Cloudflare R2-compatible object storage, with signed upload/download support
- Email delivery through SMTP for OTP and application messages

## Stack

### Frontend (`web_client`)

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS, Ant Design, and custom CSS
- Redux Toolkit and React Redux for cart, wishlist, product, and UI state
- Axios for API requests
- NextAuth/Google OAuth-related integrations
- Razorpay Checkout.js for online payments

### Backend (`server`)

- Node.js with Express 5 using ES modules
- Prisma ORM 7
- PostgreSQL 15
- JWT authentication, bcrypt password hashing, Joi validation, Helmet, CORS, and Morgan logging
- Razorpay server SDK for payment order creation and verification
- Nodemailer for SMTP email
- AWS SDK S3 client for R2-compatible file storage

## Project structure

```text
.
├── web_client/       # Next.js storefront and admin UI
├── server/            # Express API and Prisma schema/migrations
├── docker-compose.yml # Local PostgreSQL service
└── NOTES.md           # Project-specific development notes
```

## Requirements

- Node.js 20 or later
- npm
- Docker and Docker Compose, or an available PostgreSQL 15 database

## Local setup

1. Start PostgreSQL with Docker Compose:

   ```bash
   docker compose up -d postgres
   ```

2. Configure the API environment:

   ```bash
   cd server
   cp env.example .env
   ```

   Set at least `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `SERVER_ADDRESS`, and the Razorpay credentials. Configure SMTP for email/OTP functionality and R2 variables when using object-storage uploads.

3. Install API dependencies, apply Prisma migrations, and start the API:

   ```bash
   npm install
   npx prisma migrate deploy
   npm run dev
   ```

   The API is mounted under `/api`. The development frontend configuration expects `http://localhost:4000/api`; set `PORT=4000` if using that default.

4. Configure and start the frontend in a second terminal:

   ```bash
   cd web_client
   npm install
   touch .env.local
   npm run dev
   ```

   Update `NEXT_PUBLIC_API_BASE_URL` and provide the required Google and Razorpay public settings in `.env.local`.

## Environment variables

The server template is available at [`server/env.example`](server/env.example). Important server variables include:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | JWT configuration |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Server-side Razorpay integration |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | OTP and email delivery |
| `R2_*` | Optional Cloudflare R2-compatible file storage |
| `GOOGLE_CLIENT_ID` | Server-side Google token verification |

The frontend uses `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_RAZORPAY_CHECKOUT_LINK`, `NEXT_PUBLIC_PAYMENT_TIMEOUT_SECONDS`, and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

Do not commit real credentials or private environment files.

## Database

The Prisma schema is at [`server/prisma/schema.prisma`](server/prisma/schema.prisma), and migration history is in [`server/prisma/migrations`](server/prisma/migrations). Useful commands from `server/`:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma studio
```

For development schema changes, follow the repository instructions in [`NOTES.md`](NOTES.md).

## Production builds

```bash
cd web_client
npm run build
npm run start
```

```bash
cd server
npm start
```

Both services include Dockerfiles and expose port `10000` in their container images. The included Compose file currently provisions PostgreSQL only; application services must be run separately or added to the Compose configuration.

## API areas

The Express API is available below `/api` and includes routes for authentication, products, categories, sizes, colors, users, addresses, files, cart, wishlist, orders, configuration, dashboard, HSN, and audit logs. Dashboard and audit-log routes are restricted to administrators.

## Status

This README describes the functionality and technology currently represented in the repository. No automated test suite is configured yet; the server `test` script is currently a placeholder.
