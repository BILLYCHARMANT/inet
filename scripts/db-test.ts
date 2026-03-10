/**
 * Test database connection. Run: npx tsx scripts/db-test.ts
 * Use this to see the real connection error (e.g. ECONNREFUSED, wrong password).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function parseMySqlUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1).replace(/^\/+/, "") || undefined,
  };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const config = parseMySqlUrl(url);
  console.log("Connecting to:", config.host + ":" + config.port + "/" + config.database, "(user:", config.user + ")");

  const adapter = new PrismaMariaDb({
    ...config,
    connectTimeout: 10_000,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("OK – database connection successful.");
  } catch (err: unknown) {
    console.error("Connection failed:");
    console.error(err);
    const e = err as { cause?: unknown; meta?: { driverAdapterError?: { cause?: unknown } } };
    const cause = e.meta?.driverAdapterError?.cause ?? e.cause;
    const causeStr = typeof cause === "object" && cause !== null && "cause" in cause
      ? String((cause as { cause?: unknown }).cause)
      : cause ? String(cause) : "";
    if (cause) {
      console.error("Underlying cause:", cause);
      if (typeof cause === "object" && cause !== null && "message" in cause) {
        console.error("Message:", (cause as { message: string }).message);
      }
    }
    if (causeStr.includes("max_connections_per_hour")) {
      console.error("\nHostinger: you have exceeded the connection limit (500/hour). Wait up to an hour for it to reset.");
      console.error("The app is configured with a small pool (connectionLimit: 2) to avoid this. Restart the app and try again later.");
    } else {
      console.error("\nIf you use Hostinger: enable Remote MySQL in hPanel (Databases → Remote MySQL) and add your IP.");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
