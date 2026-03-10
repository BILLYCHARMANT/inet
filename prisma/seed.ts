import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

function parseMySqlUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1) || undefined,
  };
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaMariaDb(parseMySqlUrl(url));
const prisma = new PrismaClient({ adapter });

async function main() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@inetmaker.example";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin123!";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@inetmaker.example";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const mentorEmail = process.env.MENTOR_EMAIL ?? "mentor@inetmaker.example";
  const mentorPassword = process.env.MENTOR_PASSWORD ?? "Mentor123!";

  const hash = (p: string) => bcrypt.hash(p, 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    create: {
      email: superAdminEmail,
      name: "Super Admin",
      password: await hash(superAdminPassword),
      role: Role.SUPER_ADMIN,
    },
    update: {
      role: Role.SUPER_ADMIN,
      name: "Super Admin",
      // only update password if it was the default (optional: skip update of password on re-seed)
    },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin",
      password: await hash(adminPassword),
      role: Role.ADMIN,
    },
    update: {
      role: Role.ADMIN,
      name: "Admin",
    },
  });

  await prisma.user.upsert({
    where: { email: mentorEmail },
    create: {
      email: mentorEmail,
      name: "Mentor",
      password: await hash(mentorPassword),
      role: Role.MENTOR,
    },
    update: {
      role: Role.MENTOR,
      name: "Mentor",
    },
  });

  await prisma.callForApplication.upsert({
    where: { slug: "join" },
    create: {
      title: "Join INET Community",
      slug: "join",
      type: "APPLICATION",
      summary: "Get an account to see all upcoming opportunities and receive alerts by email and in the platform.",
      description: "Community membership signup for INET Maker. One profile for the whole community and all programs.",
      published: true,
      status: "open",
      formSchema: [],
    },
    update: {
      title: "Join INET Community",
      summary: "Get an account to see all upcoming opportunities and receive alerts by email and in the platform.",
      published: true,
      status: "open",
    },
  });

  console.log("Seeded: Super Admin, Admin, Mentor credentials; default 'join' call.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
