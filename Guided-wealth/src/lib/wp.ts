// Headless WordPress data layer.
// Reads public posts from the WordPress.com REST gateway (no auth, no secrets).
// Base URL comes from VITE_WP_API_URL so the client's site can be swapped in later
// without touching code. All fetchers degrade gracefully to empty/null on failure.

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  jetpack_featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
    'wp:term'?: Array<Array<{ name: string }>>;
  };
}

const BASE = (import.meta.env.VITE_WP_API_URL as string | undefined)?.replace(/\/+$/, '');

/** True when a WordPress base URL is configured. */
export function wpEnabled(): boolean {
  return Boolean(BASE);
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`WordPress request failed (${res.status})`);
  return (await res.json()) as T;
}

/** Latest published posts, newest first. Returns [] when disabled or on error. */
export async function fetchPosts(perPage = 12): Promise<WPPost[]> {
  if (!BASE) return [];
  try {
    return await getJSON<WPPost[]>(`${BASE}/posts?_embed&per_page=${perPage}&status=publish`);
  } catch (err) {
    console.error('[wp] fetchPosts failed:', err);
    return [];
  }
}

/** Single post by its slug, or null if not found / disabled / error. */
export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  if (!BASE) return null;
  try {
    const posts = await getJSON<WPPost[]>(
      `${BASE}/posts?slug=${encodeURIComponent(slug)}&_embed&status=publish`,
    );
    return posts[0] ?? null;
  } catch (err) {
    console.error('[wp] fetchPostBySlug failed:', err);
    return null;
  }
}

/** Best available featured image URL for a post (may be undefined). */
export function postImage(post: WPPost): string | undefined {
  return (
    post.jetpack_featured_media_url ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    undefined
  );
}

/** Category names for a post (empty when none). _embed returns [[categories],[tags]]. */
export function postCategories(post: WPPost): string[] {
  const groups = post._embedded?.['wp:term'] ?? [];
  const categories = groups[0] ?? [];
  return categories.map((t) => t.name).filter(Boolean);
}

/** Human-friendly date, e.g. "12 Oct 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Strip HTML tags + decode entities to plain text (for titles in <title>/aria). */
export function htmlToText(html: string): string {
  const el = document.createElement('div');
  el.innerHTML = html;
  return (el.textContent || '').trim();
}
