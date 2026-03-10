This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication

The app supports **sign in with Google, GitHub, or email/password (credentials)**. Users stay logged in for 30 days. The **E-Learning** section requires login.

### Setup

1. Copy env and set required values:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` – MySQL: `mysql://USER:PASSWORD@HOST:3306/DATABASE`
   - `AUTH_SECRET` – run `openssl rand -base64 32` and paste the result
   - For Google: create OAuth credentials and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - For GitHub: create an OAuth App and set `GITHUB_ID`, `GITHUB_SECRET`

2. Create the database and generate the client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. Seed **Super Admin**, **Admin**, and **Mentor** credentials (optional; defaults in `.env.example`):
   ```bash
   npm run db:seed
   ```
   Default seed accounts: `superadmin@inetmaker.example` / `SuperAdmin123!`, `admin@inetmaker.example` / `Admin123!`, `mentor@inetmaker.example` / `Mentor123!`. Override with env vars: `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `MENTOR_EMAIL`, `MENTOR_PASSWORD`.

4. Run the app. **Register** at `/register` (email/password) or **Sign in** at `/login` with Google, GitHub, or credentials. Then open **E-Learning** (`/e-learning`) to use the protected area. Log in with the seeded accounts to use **Super Admin**, **Admin**, or **Mentor** roles (role shown in the header dropdown).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
