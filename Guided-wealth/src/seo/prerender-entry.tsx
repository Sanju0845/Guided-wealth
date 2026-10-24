// Build-time prerender entry — compiled by `vite build --config vite.ssr.config.ts`
// and executed by scripts/prerender.mjs. Renders the route tree for one path to
// a static HTML body string. The <head> SEO tags are generated separately by the
// script via buildHeadTags()/headTagsToString() (no react-helmet needed).
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppShell } from '../App';

// Re-exported so scripts/prerender.mjs (plain Node) can pull the head-tag
// builder + route table from this single compiled bundle.
export { buildHeadTags, headTagsToString } from './headTags';
export { getAllStaticPaths, getSeoForPath, SITE_URL } from './seoConfig';

// MemoryRouter (not BrowserRouter) works during renderToString and resolves
// <Link> hrefs to real absolute paths, so crawlers can follow internal links.
export function renderRoute(path: string): string {
  return renderToString(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppShell pathname={path} />
      </MemoryRouter>
    </AuthProvider>,
  );
}
