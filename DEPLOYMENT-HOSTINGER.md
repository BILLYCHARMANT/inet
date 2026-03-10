# Deploying INET Maker App on Hostinger

This guide helps you deploy the Next.js app on Hostinger (VPS or Node.js hosting).

---

## 1. Requirements

- **Node.js 18+** on the server (Hostinger VPS or Node.js hosting)
- **MySQL database** on Hostinger (already set up; use Remote MySQL for the app server)
- Your **domain** or Hostinger subdomain pointing to the server

---

## 2. Database (Hostinger MySQL)

1. In **hPanel** go to **Databases → MySQL Databases** and note:
   - Database name, username, password
   - Host (e.g. `localhost` if app is on same server, or the host shown in **Remote MySQL**)
2. **Enable Remote MySQL** if the app runs on a different server or your PC for testing:
   - **Databases → Remote MySQL**
   - Add the **IP address** of the server (or your IP for testing)
3. **Connection limit:** Hostinger limits connections per hour (~500). The app uses a small pool (2 connections) to stay under this. If you hit “max_connections_per_hour”, wait up to an hour or reduce traffic.
4. Run migrations from your machine or the server (see step 5):
   ```bash
   npx prisma db push
   npm run db:seed
   ```

---

## 3. Environment Variables

Create a `.env` file **on the server** (or in Hostinger’s “Environment” / “App Settings” if available). Do **not** commit `.env` to git.

Copy `env.hostinger.example` to `.env` on the server and fill in values (or use the same variables as `.env.example`):

| Variable | Description | Example |
|----------|--------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://USER:PASSWORD@HOST:3306/DATABASE` |
| `AUTH_SECRET` | NextAuth secret (min 32 chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full public URL of your app | `https://yourdomain.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth (optional) | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) | From Google Cloud Console |
| `GITHUB_ID` | GitHub OAuth (optional) | From GitHub Developer Settings |
| `GITHUB_SECRET` | GitHub OAuth (optional) | From GitHub Developer Settings |

- **NEXTAUTH_URL:** Must be the exact URL users use (e.g. `https://inetmaker.com`). No trailing slash.
- **OAuth:** If you use Google/GitHub, set the redirect URI to `https://yourdomain.com/api/auth/callback/google` (or `/api/auth/callback/github`).

---

## 4. Prepare the Build (on your PC or CI)

From the project root:

```bash
npm ci
npm run build:hostinger
```

This runs `prisma generate`, `next build`, and then copies `public/` and `.next/static` into `.next/standalone`. The folder **`.next/standalone`** is what you deploy.

---

## 5. Deploy to Hostinger

### Option A: Upload the standalone folder (FTP / File Manager)

1. Zip the **`.next/standalone`** folder (and the root **`.env`** if you keep it there).
2. Upload to the server (e.g. `domains/yourdomain.com/` or a subfolder).
3. On the server, create `.env` in the **same directory that contains the `standalone` folder** (i.e. project root), or set env vars in Hostinger’s panel.
4. Install Node 18+ if needed, then run:
   ```bash
   cd /path/to/your/site
   node .next/standalone/server.js
   ```
5. Set **PORT** if required (default 3000):
   ```bash
   PORT=3000 node .next/standalone/server.js
   ```
6. Keep the process running: use **PM2** or Hostinger’s “Node.js app” / process manager:
   ```bash
   npm install -g pm2
   pm2 start .next/standalone/server.js --name inet-app
   pm2 save && pm2 startup
   ```

### Option B: Git + build on server (VPS)

1. Clone the repo on the server:
   ```bash
   git clone <your-repo-url> inet-app && cd inet-app
   ```
2. Create `.env` with production values.
3. Build and prepare standalone:
   ```bash
   npm ci
   npm run build:hostinger
   ```
4. Run with PM2:
   ```bash
   cd .next/standalone
   pm2 start server.js --name inet-app
   ```
   Or from project root (if you run from root and PM2 can find the file):
   ```bash
   pm2 start .next/standalone/server.js --name inet-app
   ```

---

## 6. Reverse Proxy (recommended for VPS)

If you use Nginx or Apache in front of Node:

- **Nginx** – proxy `http://127.0.0.1:3000` (or your `PORT`) to your domain.
- **Apache** – use `ProxyPass` to the same address.

Example Nginx server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable HTTPS (e.g. Let’s Encrypt) in hPanel or with certbot.

---

## 7. Uploaded Files (Call Images)

Admin-uploaded images are stored under **`public/uploads`**. On the server:

- Ensure the directory exists and is writable by the Node process:
  ```bash
  mkdir -p public/uploads/images
  chmod 755 public/uploads
  ```
- If you use **standalone**, the app serves from `.next/standalone`. Copy or symlink `public/uploads` into `.next/standalone/public/uploads` so uploads persist and are served. Alternatively, run the app from project root so that `public/` is the same as in development.

---

## 8. Checklist Before Go-Live

- [ ] `NEXTAUTH_URL` = `https://yourdomain.com` (no trailing slash)
- [ ] `AUTH_SECRET` set (32+ chars)
- [ ] `DATABASE_URL` correct; Remote MySQL allowed if app and DB are on different hosts
- [ ] `npm run db:push` and `npm run db:seed` run at least once
- [ ] OAuth redirect URIs updated to production URL
- [ ] Process manager (PM2 or Hostinger) set so the app restarts after reboot
- [ ] HTTPS enabled and proxy headers (X-Forwarded-Proto, etc.) set so NextAuth works behind the proxy

---

## 9. Troubleshooting

| Issue | What to do |
|-------|------------|
| Pool timeout / DB connection failed | Check `DATABASE_URL`; enable Remote MySQL and add server IP; run `npm run db:test` from the server. |
| max_connections_per_hour exceeded | Wait for the limit to reset; app already uses a small connection pool (2). |
| 502 Bad Gateway | Node app not running or wrong port; check PM2 and proxy port (e.g. 3000). |
| NextAuth redirect / session issues | Ensure `NEXTAUTH_URL` is exact production URL and proxy sends `X-Forwarded-Proto: https`. |
| Uploads 404 | Ensure `public/uploads` exists and is inside the directory from which the app serves (e.g. `standalone/public` or project root `public`). |

---

## Quick Reference

- **Build for Hostinger:** `npm run build:hostinger`
- **Run production (standalone):** `node .next/standalone/server.js` (from project root) or `node server.js` from `.next/standalone`
- **Run production (full):** `npm run start` (uses full `.next`; needs `node_modules`)
