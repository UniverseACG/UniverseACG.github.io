import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "dist");
const { sites, updatedAt } = JSON.parse(await readFile(path.join(root, "src/sites.json"), "utf8"));
const base = new URL(process.env.PUBLIC_SITE_URL || "https://universeacg.github.io/");
if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) throw new Error("PUBLIC_SITE_URL must be a public HTTPS URL");
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
if (sites.length !== 3 || new Set(sites.map((site) => site.id)).size !== 3) throw new Error("Expected three distinct products");
for (const site of sites) {
  if (!/^(game|ai|video)$/.test(site.id)) throw new Error("Unknown product");
  for (const key of ["main", "cdn"]) {
    const url = new URL(site[key]);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("Invalid site entry");
  }
}
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
const external = (url, label, cls = "") => `<a href="${esc(url)}" class="${cls}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only">（在新窗口打开）</span></a>`;
function group(site) {
  return `<section aria-labelledby="title-${site.id}" class="product"><h2 id="title-${site.id}">${esc(site.name)}<span>${esc(site.label)}</span></h2><ul>${[["main", "主站"], ["cdn", "备用入口"]].map(([key, label]) => `<li>${external(site[key], `<span class="entry-title">${label}</span>${arrow}`, `entry${key === "main" ? " primary" : ""}`)}</li>`).join("")}</ul></section>`;
}
function render(site) {
  const prefix = site ? "../" : "./";
  const title = site ? `${site.name} · 回家的路` : "UACG · 回家的路";
  const description = site ? `${site.name} 主站与备用地址。` : "UACG 游戏、AI、视频主站与备用地址。";
  const route = site ? `${site.id}/` : "";
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fff8fa">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="referrer" content="no-referrer">
<link rel="canonical" href="${esc(new URL(route, base))}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(new URL("assets/icon-512.png", base))}">
<link rel="icon" href="${prefix}assets/uacg-logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="${prefix}assets/style.css">
</head>
<body>
<a class="skip-link" href="#main">跳到访问入口</a>
<div class="page">
<header><a class="brand" href="${prefix}" aria-label="UACG 回家的路首页"><img src="${prefix}assets/uacg-logo.svg" alt="" width="40" height="40"><span>UACG</span></a><h1>回家的路</h1></header>
<main id="main">${(site ? [site] : sites).map(group).join("\n")}</main>
<footer>${site ? `<nav aria-label="其他发布页"><a href="../">全部入口</a>${sites.filter((s) => s.id !== site.id).map((s) => `<a href="../${s.id}/">${esc(s.label)}</a>`).join("")}</nav>` : ""}${external("https://t.me/uacg_channel", "TG 频道")}</footer>
</div>
</body>
</html>`;
}
await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, "assets"), { recursive: true });
await cp(path.join(root, "src/assets"), path.join(out, "assets"), { recursive: true });
await writeFile(path.join(out, "index.html"), render());
for (const site of sites) {
  await mkdir(path.join(out, site.id), { recursive: true });
  await writeFile(path.join(out, site.id, "index.html"), render(site));
}
await writeFile(path.join(out, ".nojekyll"), "");
await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", base)}\n`);
await writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", ...sites.map((site) => `${site.id}/`)].map((route) => `<url><loc>${esc(new URL(route, base))}</loc><lastmod>${updatedAt}</lastmod></url>`).join("")}</urlset>`);
await writeFile(path.join(out, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'\n  Cache-Control: public, max-age=0, must-revalidate\n");
console.log("Built 4 UACG address pages with 6 business entry URLs.");
