// Client-side SEO: applies per-route <head> tags on every navigation using
// the shared buildHeadTags() helper (no react-helmet dependency, which is
// not React 19 type-safe). The same tags are baked into static HTML at build
// time by scripts/prerender.mjs, so crawlers get them without JS.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildHeadTags } from './headTags';

interface SeoProps {
  pathname?: string;
}

/** Tags we manage are marked with data-seo-* or well-known name/property so
    we can swap them on navigation without touching the rest of the head. */
function applyTags(pathname: string) {
  const tags = buildHeadTags(pathname);

  // Remove previously-injected SEO nodes.
  document.querySelectorAll('head [data-seoinject="1"]').forEach((el) => el.remove());

  for (const t of tags) {
    let el: HTMLElement;
    if (t.tag === 'title') {
      el = document.createElement('title');
      el.textContent = t.content ?? '';
    } else {
      el = document.createElement(t.tag);
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
      if (t.tag === 'script') el.textContent = t.content ?? '';
    }
    el.setAttribute('data-seoinject', '1');
    document.head.appendChild(el);
  }
}

export default function Seo({ pathname }: SeoProps) {
  const location = useLocation();
  const path = pathname ?? location.pathname;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    applyTags(path);
  }, [path]);

  return null;
}
