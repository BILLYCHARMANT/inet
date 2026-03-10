# Deploying INET Maker App on Vercel

This project is set up to deploy on **Vercel**. The build uses the default Next.js output on Vercel (no standalone); for self-hosting (e.g. Hostinger) see [DEPLOYMENT-HOSTINGER.md](./DEPLOYMENT-HOSTINGER.md).

---

## Before you deploy: set environment variables

**The build will succeed only if the app can load without connecting to the DB.** You still **must** add these in Vercel **before or right after** connecting the repo, or the app will fail at runtime:

1. In your Vercel project go to **Settings → Environment Variables**.
2. Add **at least** these for **Production** (and **Preview** if you use preview deployments):
   - **`DATABASE_URL`** – your MySQL connection string (e.g. from Hostinger).
   - **`AUTH_SECRET`** – run `openssl rand -base64 32` and paste the result.
   - **`NEXTAUTH_URL`** – set to your Vercel URL **after** the first deploy (e.g. `https://your-project.vercel.app`), or leave blank for the first deploy and set it immediately after, then redeploy.

Without `DATABASE_URL` and `AUTH_SECRET`, the site will build but will show errors when users sign in or when any page uses the database.

---

## 1. Connect your repo

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub recommended).
2. **Add New Project** → Import your repo `BILLYCHARMANT/inet` (or your fork).
3. Set **Root Directory** to `inet-app` if the repo root is the parent folder (i.e. the Next.js app is inside `inet-app/`). If the repo root is the app itself, leave it as `.`
4. **Framework Preset**: Next.js (auto-detected).
5. **Build Command**: `npm run build` (default) or leave empty.
6. **Output Directory**: leave default (Vercel uses Next.js output automatically).
7. **Install Command**: `npm install` (default).

---

## 2. Environment variables

In the Vercel project: **Settings → Environment Variables**. Add these for **Production** (and Preview if you want):

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string (Hostinger, PlanetScale, etc.) | `mysql://USER:PASSWORD@HOST:3306/DATABASE` |
| `AUTH_SECRET` | NextAuth secret (min 32 chars) | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | **Your Vercel app URL** (no trailing slash) | `https://your-app.vercel.app` or your custom domain |

Optional (OAuth):

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_ID` | GitHub OAuth app client ID |
| `GITHUB_SECRET` | GitHub OAuth app client secret |

**Important:**

- **NEXTAUTH_URL** must be the exact URL users use (e.g. `https://inet-maker.vercel.app`). After the first deploy, Vercel gives you a URL; set `NEXTAUTH_URL` to that (or your custom domain).
- For Google/GitHub OAuth, set the redirect URI to:
  - `https://your-app.vercel.app/api/auth/callback/google`
  - `https://your-app.vercel.app/api/auth/callback/github`
  (or your custom domain).

---

## 3. Database

- Use a **MySQL** database (e.g. Hostinger MySQL, PlanetScale, Railway, etc.).
- If the DB is on Hostinger, enable **Remote MySQL** and add Vercel’s IP or allow all (Hostinger may list “Any” for remote access).
- Run migrations and seed **once** from your machine (using the same `DATABASE_URL` you set on Vercel):
  ```bash
  npx prisma db push
  npm run db:seed
  ```

---

## 4. Deploy

Click **Deploy**. Vercel will:

1. Run `npm install`
2. Run `prisma generate` (via your `postinstall` or as part of `npm run build`)
3. Run `npm run build` (prisma generate + next build)
4. Deploy the app

After deploy, open your project URL and test login, dashboard, and apply flows.

---

## 5. Custom domain (optional)

In the Vercel project: **Settings → Domains** → add your domain and follow DNS instructions. Then set:

- `NEXTAUTH_URL=https://yourdomain.com`
- Update OAuth redirect URIs to `https://yourdomain.com/api/auth/callback/google` (and GitHub if used).

---

## 6. Checklist

- [ ] **`DATABASE_URL`** set in Vercel (Settings → Environment Variables) – required for app to work.
- [ ] **`AUTH_SECRET`** set in Vercel (e.g. from `openssl rand -base64 32`).
- [ ] **`NEXTAUTH_URL`** set to your Vercel URL or custom domain (no trailing slash).
- [ ] Repo connected; root directory correct (`inet-app` or `.`).
- [ ] DB is reachable from the internet (e.g. Hostinger Remote MySQL allowed for Vercel IPs or "Any").
- [ ] `prisma db push` and `db:seed` run once against production DB (from your machine with the same `DATABASE_URL`).
- [ ] OAuth redirect URIs updated to production URL if using Google/GitHub.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails (Prisma/TypeScript) | Check build logs; ensure all env vars are set for the build (Prisma often needs `DATABASE_URL` at build for generate). |
| “Database connection failed” / pool timeout | Check `DATABASE_URL`; ensure DB allows connections from Vercel’s IPs (or “Any” if your provider supports it). |
| NextAuth redirect / session errors | Ensure `NEXTAUTH_URL` matches the URL in the browser exactly (https, no trailing slash). |
| 404 on API routes | Confirm root directory is correct so Vercel finds `package.json` and `next.config`. |
