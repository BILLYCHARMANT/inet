#!/usr/bin/env node
/**
 * After "next build" with output: "standalone", copies public/ and .next/static
 * into .next/standalone so the standalone server can serve them.
 * Run from project root: node scripts/prepare-standalone.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");
const publicDir = path.join(root, "public");
const staticDir = path.join(root, ".next", "static");
const standaloneNext = path.join(standalone, ".next");

if (!fs.existsSync(standalone)) {
  console.error("Run 'npm run build' first. .next/standalone not found.");
  process.exit(1);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, path.join(standalone, "public"));
  console.log("Copied public/ to .next/standalone/public");
}
if (fs.existsSync(staticDir)) {
  fs.mkdirSync(standaloneNext, { recursive: true });
  copyRecursive(staticDir, path.join(standaloneNext, "static"));
  console.log("Copied .next/static to .next/standalone/.next/static");
}
console.log("Standalone folder is ready. On server run: node .next/standalone/server.js");
