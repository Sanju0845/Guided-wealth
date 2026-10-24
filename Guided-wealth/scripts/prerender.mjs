// Build-time prerenderer.
// Runs AFTER `vite build` (client → dist/) and `vite build --ssr` (→ dist-ssr/).
// For every static route it renders the React tree to an HTML body string,
// injects per-route SEO <head> tags into the built index.html template and
// writes a real static document (e.g. dist/services/index.html) so crawlers —
// including non-JS ones (UC Browser, older WebViews) — receive full content.
// Also emits dist/sitemap.xml from the route table + live WordPress posts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
dotenv.config({ path: path.join(ROOT, '.env') });

const entry = await import(pathToFileURL(path.join(ROOT, 'dist-ssr', 'prerender-entry.js')).href);
const { renderRoute, buildHeadTags, headTagsToString, getAllStaticPaths, SITE_URL } = entry;

// ── Load live WordPress posts so blog/:slug pages get real titles/descs ──
const WP_BASE = (process.env.VITE_WP_API_URL || '').replace(/\/+$/, '');
/** @type {Record<string,{title:string,excerpt:string,date:string}>} */
const blogPosts = {};
let blogPaths = [];
if (WP_BASE) {
  try {
    const res = await fetch(`${WP_BASE}/posts?per_page=100&status=publish`);
    if (res.ok) {
      const posts = await res.json();
      for (const p of posts) {
        blogPosts[p.slug] = { title: p.title.rendered, excerpt: p.excerpt.rendered, date: p.date };
        blogPaths.push({ path: `/blog/${p.slug}`, lastmod: p.modified_gmt || p.date });
      }
      console.log(`[prerender] loaded ${posts.length} WordPress post(s)`);
    }
  } catch (e) {
    console.warn('[prerender] WP fetch failed, blog pages will use fallback meta:', e.message);
  }
}
// Expose to the (already-imported) seoConfig via the global it reads.
globalThis.__PRERENDER_BLOG_POSTS__ = blogPosts;

// ── Read the built client index.html as our template ──
const templatePath = path.join(DIST, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html missing — run `vite build` first.');
  process.exit(1);
}
const rawTemplate = fs.readFileSync(templatePath, 'utf8');

// Strip the template's placeholder <title> + description meta so per-route
// tags are the single source of truth (avoids duplicate tags).
function baseTemplate() {
  return rawTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '');
}

function buildDocument(routePath, template) {
  const headTags = headTagsToString(buildHeadTags(routePath));
  let bodyHtml = '';
  try {
    bodyHtml = renderRoute(routePath);
  } catch (e) {
    console.warn(`[prerender] render failed for ${routePath}, writing head-only shell: ${e.message}`);
    bodyHtml = '';
  }
  let html = template.replace('</head>', `    ${headTags}\n  </head>`);
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${bodyHtml}</div>`);
  return html;
}

const template = baseTemplate();

// ── Write one static HTML file per route ──
const allPaths = [
  ...getAllStaticPaths().map((p) => ({ path: p, lastmod: null })),
  ...blogPaths,
];

let written = 0;
for (const { path: routePath } of allPaths) {
  const html = buildDocument(routePath, template);
  const clean = routePath.replace(/\/+$/, '') || '/';
  const dir =
    clean === '/'
      ? DIST
      : path.join(DIST, ...clean.split('/').filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}
console.log(`[prerender] wrote ${written} static HTML document(s)`);

// ── Generate sitemap.xml (excludes noindex pages) ──
function sitemapEntry(routePath, lastmod) {
  const loc = `${SITE_URL}${routePath === '/' ? '/' : routePath}`;
  const lm = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${lm}\n  </url>`;
}

const { getSeoForPath } = entry;
const sitemapPaths = allPaths.filter((r) => {
  const seo = getSeoForPath(r.path.replace(/\/+$/, '') || '/');
  return !seo || !seo.noindex;
});
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapPaths.map((r) => sitemapEntry(r.path, r.lastmod)).join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8');
console.log(`[prerender] sitemap.xml → ${sitemapPaths.length} URLs`);
