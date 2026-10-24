// ─────────────────────────────────────────────────────────────────────
// Central SEO configuration — single source of truth for per-route
// title / description / canonical / JSON-LD used by BOTH:
//   • the browser <Seo> component (client-side navigation updates)
//   • the build-time prerender script (real HTML for crawlers)
// Keep this file dependency-free (no React / DOM imports) so it can be
// imported from the Node prerender pipeline as well.
// ─────────────────────────────────────────────────────────────────────
import { calculatorData } from '../constants/calculatorData';

export const SITE_URL =
  ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://guidedwealthy.in').replace(/\/+$/, '');

export const SITE_NAME = 'Guided Wealthy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/logo.png`;

export interface SeoEntry {
  title: string;
  description: string;
  noindex?: boolean;
}

/** Decode HTML entities without DOM (works in Node prerender too). */
export function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/&ndash;|&mdash;/g, '–')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip HTML to plain text (WordPress excerpts contain <p>, […] etc). */
function excerptToText(raw: string): string {
  return decodeEntities(raw).replace(/\[…\]|\[\.\.\.\]/g, '').trim();
}

// ── Hand-written metadata for the core marketing pages ──────────────
const CORE_PAGES: Record<string, SeoEntry> = {
  '/': {
    title: 'Guided Wealthy | SEBI Registered Investment Advisor & Financial Planner',
    description:
      'Guided Wealthy is a SEBI Registered Investment Advisory service offering personalised financial planning, retirement strategy, tax optimisation and investment guidance. Book a consultation with our expert advisors.',
  },
  '/services': {
    title: 'Investment Advisory & Financial Planning Services | Guided Wealthy',
    description:
      'Explore our specialised services — investment advisory, retirement planning, tax planning, estate and goal-based wealth strategy built around your unique financial situation.',
  },
  '/about': {
    title: 'About Guided Wealthy | Ex-Banker, NISM Certified Advisory Team',
    description:
      'Guided Wealthy was founded to help individuals and families take control of their financial future with clarity, confidence and discipline. Meet the team behind our advisory approach.',
  },
  '/resources': {
    title: 'Financial Resources & Guides | Guided Wealthy',
    description:
      'Curated financial resources — guides, checklists and planning material on investments, retirement, tax and insurance to help you make informed decisions.',
  },
  '/blog': {
    title: 'Money & Investing Blog | Guided Wealthy',
    description:
      'Practical guides, market perspectives and planning ideas from the Guided Wealthy advisory team — written to help you grow your wealth wisely.',
  },
  '/research': {
    title: 'Research & Insights | Guided Wealthy',
    description:
      'Deep dives into Indian personal finance — SIP and SWP strategies, retirement corpus planning, gold vs equity, NPS vs PPF and tax-saving analysis from our advisory team.',
  },
  '/calculators': {
    title: 'Free Financial Calculators | Guided Wealthy',
    description:
      '90+ free Indian financial calculators — SIP, lumpsum, EMI, PPF, NPS, income tax, capital gains, retirement and goal planners. Accurate, quick and easy to use.',
  },
  '/booking': {
    title: 'Book a Financial Consultation | Guided Wealthy',
    description:
      'Ready to transform your financial future? Book an appointment with Guided Wealthy’s SEBI registered advisory team for personalised planning and guidance.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Guided Wealthy',
    description:
      'How Guided Wealthy collects, uses and protects your personal and financial information. Read our complete privacy policy.',
  },
  '/legal': {
    title: 'Legal Notice & Disclosures | Guided Wealthy',
    description:
      'Legal information, disclaimers and regulatory disclosures for Guided Wealthy’s investment advisory services in India.',
  },
  // Registered-user tools — deliberately kept out of search results
  '/dashboard': { title: 'Dashboard | Guided Wealthy', description: 'Your personalised financial plan dashboard.', noindex: true },
  '/profile': { title: 'My Profile | Guided Wealthy', description: 'Manage your Guided Wealthy profile.', noindex: true },
  '/assessment': {
    title: 'Wealth Risk Assessment | Guided Wealthy',
    description:
      'Answer a short questionnaire to understand your investment risk appetite and get a recommended asset allocation aligned to your goals.',
    noindex: true,
  },
  '/retirement-analysis': {
    title: 'Retirement Analysis Form | Guided Wealthy',
    description:
      'Submit your retirement details to receive a personalised retirement readiness analysis from the Guided Wealthy advisory team.',
    noindex: true,
  },
};

// ── Research article pages (curated, keyword-focused titles) ─────────
export const RESEARCH_SEO: Record<string, SeoEntry> = {
  'sip-for-1-crore': {
    title: 'SIP for ₹1 Crore Calculator — How Much to Invest Monthly? | Guided Wealthy',
    description:
      'Find out exactly how much you need to invest every month to build a ₹1 crore corpus. Free SIP-to-crore calculator with examples at different returns and time horizons.',
  },
  'sip-for-child-education': {
    title: 'Child Education SIP Calculator — Plan Education Corpus | Guided Wealthy',
    description:
      'Calculate the monthly SIP needed to fund your child’s education corpus, accounting for education inflation. Free planner for Indian parents.',
  },
  'retirement-at-45': {
    title: 'Retirement at 45 Calculator — Early Retirement Planning India | Guided Wealthy',
    description:
      'Can you retire at 45? Estimate the corpus, monthly SIP and expense plan required for early retirement in India with our free calculator.',
  },
  'retirement-at-55': {
    title: 'Retirement at 55 Calculator — Retirement Corpus Planner | Guided Wealthy',
    description:
      'Plan a retirement at 55 with a realistic corpus target, inflation-adjusted expenses and SIP requirements. Free Indian retirement calculator.',
  },
  'fire-calculator-india': {
    title: 'FIRE Calculator India — Financial Independence, Retire Early | Guided Wealthy',
    description:
      'Calculate your FIRE number for India — savings rate, corpus needed and years to financial independence using the 4% rule adapted for Indian returns.',
  },
  'swp-for-1-lakh-month': {
    title: 'SWP for ₹1 Lakh per Month — Corpus Calculator | Guided Wealthy',
    description:
      'How much corpus do you need to generate ₹1 lakh monthly income through a Systematic Withdrawal Plan? Free SWP calculator with sustainability analysis.',
  },
  'swp-for-50000-month': {
    title: 'SWP for ₹50,000 per Month — Monthly Income Calculator | Guided Wealthy',
    description:
      'Calculate the investment corpus required for a ₹50,000 monthly income via SWP, with return assumptions and how long the money will last.',
  },
  'home-loan-20-year-emi': {
    title: 'Home Loan 20 Year EMI Calculator | Guided Wealthy',
    description:
      'Estimate your EMI, total interest and payment plan for a 20-year home loan in India. Adjust loan amount and interest rate instantly.',
  },
  'gold-vs-equity-10-year': {
    title: 'Gold vs Equity — 10 Year Returns Comparison India | Guided Wealthy',
    description:
      'Compare 10-year returns of gold, equity and index funds in India. See how ₹1 lakh invested in each has actually performed.',
  },
  'gold-for-wedding-planning': {
    title: 'Gold for Wedding Planning — Goal Calculator | Guided Wealthy',
    description:
      'Planning a wedding with gold? Calculate how much to invest monthly, expected value and whether gold is the right wedding-corpus strategy.',
  },
  'rental-yield-mumbai-vs-bangalore': {
    title: 'Rental Yield: Mumbai vs Bangalore Comparison | Guided Wealthy',
    description:
      'Compare realistic rental yields in Mumbai and Bangalore — city-wise data, maintenance costs and whether rent or SIP gives better returns.',
  },
  'nps-vs-ppf-comparison': {
    title: 'NPS vs PPF — Which is Better for Retirement? | Guided Wealthy',
    description:
      'Detailed NPS vs PPF comparison — returns, tax benefits, liquidity and annuity rules — with a calculator to match them for your horizon.',
  },
  'elss-vs-ppf-tax-saving': {
    title: 'ELSS vs PPF — Tax Saving Investment Comparison | Guided Wealthy',
    description:
      'ELSS or PPF for 80C tax saving? Compare post-tax returns, lock-ins and risk to decide where your ₹1.5 lakh deduction should go.',
  },
  'freelancer-income-tax-2026': {
    title: 'Freelancer Income Tax Calculator FY 2026-27 (New Regime) | Guided Wealthy',
    description:
      'Calculate income tax as a freelancer under Section 44ADA presumptive taxation and the new regime for FY 2026-27. Includes advance-tax dates.',
  },
  'emergency-fund-calculator': {
    title: 'Emergency Fund Calculator — How Much Should You Keep? | Guided Wealthy',
    description:
      'Find your ideal emergency corpus based on monthly expenses, dependents and job stability. Free 60-second calculator for Indian households.',
  },
};

// ── Calculator pages — titles/descriptions generated from the catalog ─
const CALCULATOR_SEO: Record<string, SeoEntry> = {};
for (const section of calculatorData) {
  for (const item of section.items) {
    CALCULATOR_SEO[`/calculators/${item.slug}`] = {
      title: `${item.name} — Free Online Calculator | Guided Wealthy`,
      description: `${item.desc} Use Guided Wealthy's free ${item.name.toLowerCase()} for accurate Indian financial planning.`,
    };
  }
}

/** Blog posts discovered at prerender time (injected as a global). */
function prerenderBlogPosts(): Record<string, { title: string; excerpt: string; date: string }> {
  const w = globalThis as { __PRERENDER_BLOG_POSTS__?: Record<string, { title: string; excerpt: string; date: string }> };
  return w.__PRERENDER_BLOG_POSTS__ ?? {};
}

/** Resolve SEO metadata for any pathname. Returns null for unknown routes. */
export function getSeoForPath(pathname: string): SeoEntry | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (CORE_PAGES[path]) return CORE_PAGES[path];
  if (CALCULATOR_SEO[path]) return CALCULATOR_SEO[path];
  const research = path.match(/^\/research\/([a-z0-9-]+)$/);
  if (research && RESEARCH_SEO[research[1]]) return RESEARCH_SEO[research[1]];
  const blog = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blog) {
    const post = prerenderBlogPosts()[blog[1]];
    if (post) {
      return {
        title: `${decodeEntities(post.title)} | Guided Wealthy Blog`,
        description: excerptToText(post.excerpt).slice(0, 180) || 'Read the latest article on the Guided Wealthy blog.',
      };
    }
    const human = blog[1].replace(/-/g, ' ');
    return {
      title: `${human.charAt(0).toUpperCase() + human.slice(1)} | Guided Wealthy Blog`,
      description: 'Read this article on the Guided Wealthy blog — practical guides and perspectives on Indian personal finance.',
    };
  }
  return null;
}

/** All prerenderable/indexable static paths (noindex pages included so they render, flagged separately). */
export function getAllStaticPaths(): string[] {
  return [
    ...Object.keys(CORE_PAGES),
    ...Object.keys(CALCULATOR_SEO),
    ...Object.keys(RESEARCH_SEO).map((s) => `/research/${s}`),
  ];
}

// ── JSON-LD ───────────────────────────────────────────────────────────
export function organizationLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${SITE_URL}/#organization`,
    name: 'Guided Wealthy',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    description:
      'SEBI Registered Investment Advisor offering personalised financial planning, retirement strategy, tax optimisation and investment guidance in India.',
    areaServed: 'IN',
    sameAs: ['https://www.linkedin.com/in/guidedwealthy-undefined-0443a4424'],
  };
}

export function websiteLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Guided Wealthy',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
  };
}

export function breadcrumbLd(pathname: string, title: string): object {
  const segments = pathname.split('/').filter(Boolean);
  const items: Array<{ '@type': 'BreadcrumbList'; position: number; name: string; item: string }> = [
    { '@type': 'BreadcrumbList', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];
  let acc = '';
  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    items.push({
      '@type': 'BreadcrumbList',
      position: i + 2,
      name: i === segments.length - 1 ? title : segments[i].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      item: `${SITE_URL}${acc}`,
    });
  }
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}
