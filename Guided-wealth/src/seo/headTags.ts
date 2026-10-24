// Pure head-tag builder shared by:
//   • the client <Seo> component (applies tags to document.head imperatively)
//   • the build-time prerender script (serialises them into each static HTML)
// Dependency-free + no DOM access, so it is safe in the Node SSR bundle.
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  getSeoForPath,
  organizationLd,
  websiteLd,
  breadcrumbLd,
  type SeoEntry,
} from './seoConfig';

export interface HeadTag {
  /** 'title' | 'meta' | 'link' | 'script' */
  tag: 'title' | 'meta' | 'link' | 'script';
  attrs: Record<string, string>;
  content?: string;
}

const FALLBACK: SeoEntry = {
  title: 'Guided Wealthy | SEBI Registered Investment Advisor',
  description:
    'Guided Wealthy - SEBI Registered Investment Advisor & NISM Certified financial planning services.',
};

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

/** Build the ordered list of SEO head tags for a given pathname. */
export function buildHeadTags(pathname: string): HeadTag[] {
  const path = normalizePath(pathname);
  const seo = getSeoForPath(path) ?? FALLBACK;
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const isHome = path === '/';

  const tags: HeadTag[] = [
    { tag: 'title', attrs: {}, content: seo.title },
    { tag: 'meta', attrs: { name: 'description', content: seo.description } },
  ];

  if (seo.noindex) {
    tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } });
  }

  tags.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical } });

  // Open Graph
  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Guided Wealthy' } },
    { tag: 'meta', attrs: { property: 'og:url', content: canonical } },
    { tag: 'meta', attrs: { property: 'og:title', content: seo.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seo.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: DEFAULT_OG_IMAGE } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_IN' } },
  );

  // Twitter
  tags.push(
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seo.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seo.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: DEFAULT_OG_IMAGE } },
  );

  // JSON-LD
  if (isHome) {
    tags.push(
      { tag: 'script', attrs: { type: 'application/ld+json', 'data-seo': 'org' }, content: JSON.stringify(organizationLd()) },
      { tag: 'script', attrs: { type: 'application/ld+json', 'data-seo': 'site' }, content: JSON.stringify(websiteLd()) },
    );
  } else {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json', 'data-seo': 'crumb' },
      content: JSON.stringify(breadcrumbLd(path, seo.title.split(' | ')[0])),
    });
  }

  return tags;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Serialise head tags to an HTML string (for prerender injection). */
export function headTagsToString(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      const attrStr = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${esc(v)}"`)
        .join(' ');
      if (t.tag === 'title') return `<title>${esc(t.content ?? '')}</title>`;
      if (t.tag === 'script') return `<script ${attrStr}>${t.content ?? ''}</script>`;
      if (t.tag === 'link') return `<link ${attrStr} />`;
      // meta
      return `<meta ${attrStr} />`;
    })
    .join('\n    ');
}
