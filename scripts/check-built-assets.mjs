#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import path from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const ASSET_EXTENSIONS = new Set([
  ".avif", ".css", ".eot", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".json", ".map",
  ".mjs", ".mp3", ".mp4", ".ogg", ".otf", ".pdf", ".png", ".svg", ".ttf", ".webm",
  ".webp", ".woff", ".woff2", ".xml",
]);

if (!existsSync(DIST)) {
  throw new Error("dist tidak ditemukan. Jalankan build sebelum memeriksa asset.");
}

const files = walk(DIST);
const exactFiles = new Set(files.map(toDistPath));
const missing = new Map();
const cssQueue = new Set();
const checkedCss = new Set();

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (extension === ".html") checkHtml(file);
}

while (cssQueue.size) {
  const cssPath = cssQueue.values().next().value;
  cssQueue.delete(cssPath);
  if (checkedCss.has(cssPath)) continue;
  checkedCss.add(cssPath);
  checkCss(resolve(DIST, `.${cssPath}`));
}

if (missing.size) {
  console.error(`Built asset check found ${missing.size} missing or case-mismatched local asset(s):`);
  for (const [asset, sources] of [...missing.entries()].sort()) {
    console.error(`- ${asset}`);
    for (const source of [...sources].sort().slice(0, 5)) console.error(`  from ${source}`);
  }
  process.exit(1);
}

const requiredDirectories = ["/_astro/", "/css/", "/js/", "/wp-content/", "/wp-includes/", "/clerk/"];
for (const directory of requiredDirectories) {
  if (![...exactFiles].some((file) => file.startsWith(directory))) {
    console.error(`Built asset check expected files under ${directory}, but none were deployed.`);
    process.exit(1);
  }
}

if (!exactFiles.has("/_redirects")) {
  console.error("Built asset check expected dist/_redirects from public/_redirects.");
  process.exit(1);
}

console.log(`Built asset check passed for ${files.length} deployed files; all local HTML/CSS asset references resolve with exact casing.`);

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath));
    if (entry.isFile()) result.push(fullPath);
  }
  return result;
}

function checkHtml(file) {
  const source = readFileSync(file, "utf8");
  const attributePattern = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  const srcsetPattern = /\b(?:srcset|imagesrcset)\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = attributePattern.exec(source))) checkReference(match[1], file);
  while ((match = srcsetPattern.exec(source))) {
    for (const candidate of match[1].split(",")) checkReference(candidate.trim().split(/\s+/)[0], file);
  }
}

function checkCss(file) {
  const source = readFileSync(file, "utf8");
  const urlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  const importPattern = /@import\s+(?:url\()?\s*["']([^"']+)["']/gi;
  let match;

  while ((match = urlPattern.exec(source))) checkReference(match[1], file);
  while ((match = importPattern.exec(source))) checkReference(match[1], file);
}

function checkReference(rawReference, sourceFile) {
  const cleaned = String(rawReference || "")
    .trim()
    .replace(/&amp;/g, "&")
    .split(/[?#]/, 1)[0];

  if (!cleaned || /^(?:[a-z]+:|\/\/|#|data:|blob:|\{)/i.test(cleaned)) return;

  let decoded;
  try {
    decoded = decodeURIComponent(cleaned);
  } catch (_error) {
    decoded = cleaned;
  }

  const assetExtension = extname(decoded).toLowerCase();
  if (!ASSET_EXTENSIONS.has(assetExtension)) return;

  const sourcePath = toDistPath(sourceFile);
  const candidate = decoded.startsWith("/")
    ? path.posix.normalize(decoded)
    : path.posix.resolve(path.posix.dirname(sourcePath), decoded);
  const normalized = candidate.startsWith("/") ? candidate : `/${candidate}`;

  if (!exactFiles.has(normalized)) {
    if (!missing.has(normalized)) missing.set(normalized, new Set());
    missing.get(normalized).add(sourcePath);
    return;
  }

  if (assetExtension === ".css") cssQueue.add(normalized);
}

function toDistPath(file) {
  return `/${relative(DIST, file).split(sep).join("/")}`;
}
