// Financial Modeling Prep helpers using the CURRENT "stable" API
// (the old /api/v3/ endpoints were retired Aug 2025 -> 403 "Legacy Endpoint").
// Every call is independent and returns null/[] on failure, so a missing key or
// an unsupported symbol never breaks the digest — that section is just omitted.
//
// Symbols are env-overridable if FMP's India coverage/format differs:
//   FMP_INDEX_SYMBOLS, FMP_WATCH_SYMBOLS
const BASE = 'https://financialmodelingprep.com/stable';

const apiKey = () => process.env.FMP_API_KEY;

async function getStable(endpoint, params = {}) {
  if (!apiKey()) return null;
  try {
    const qs = new URLSearchParams({ ...params, apikey: apiKey() }).toString();
    const res = await fetch(`${BASE}${endpoint}?${qs}`);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.includes('Error Message') || text.includes('premium') || text.includes('"Note"')) {
      return null;
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// "Label:^SYMBOL,Label2:^SYMBOL2"
function parseIndexSymbols() {
  const raw =
    process.env.FMP_INDEX_SYMBOLS || 'SENSEX:^BSESN,NIFTY 50:^NSEI,NIFTY BANK:^NSEBANK';
  return raw
    .split(',')
    .map((pair) => {
      const [label, symbol] = pair.split(':');
      return { label: (label || '').trim(), symbol: (symbol || '').trim() };
    })
    .filter((x) => x.label && x.symbol);
}

export async function getMarketOverview() {
  const items = parseIndexSymbols();
  const symbols = items.map((i) => i.symbol).join(',');
  const data = await getStable('/quote', { symbol: symbols });
  const bySymbol = {};
  (Array.isArray(data) ? data : []).forEach((d) => {
    bySymbol[d.symbol] = d;
  });
  const rows = items
    .map((i) => {
      const d = bySymbol[i.symbol];
      if (!d || d.price == null) return null;
      return { label: i.label, level: Number(d.price), changePct: Number(d.changesPercentage || 0) };
    })
    .filter(Boolean);
  const fx = await getFxUsdInr();
  if (fx) rows.push(fx);
  return rows;
}

async function getFxUsdInr() {
  const data = await getStable('/forex/quote', { symbol: 'USAINR' });
  const d = Array.isArray(data) ? data[0] : data;
  if (!d || d.price == null) return null;
  return { label: 'USD/INR', level: Number(d.price), changePct: Number(d.changePercentage || d.changesPercentage || 0) };
}

export async function getMovers() {
  const raw =
    process.env.FMP_WATCH_SYMBOLS ||
    'RELIANCE.NS,TCS.NS,HDFCBANK.NS,ICICIBANK.NS,INFY.NS,SBIN.NS,BHARTIARTL.NS,ITC.NS,HINDUNILVR.NS,KOTAKBANK.NS,AXISBANK.NS,LT.NS,BAJFINANCE.NS,M&M.NS,ASIANPAINT.NS,SUNPHARMA.NS,TATAMOTORS.NS,TATASTEEL.NS,JSWSTEEL.NS,HCLTECH.NS';
  const symbols = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const data = await getStable('/quote', { symbol: symbols.join(',') });
  const list = (Array.isArray(data) ? data : [])
    .filter((d) => d && d.price != null && (d.changesPercentage != null || d.changePercentage != null))
    .map((d) => ({
      symbol: String(d.symbol).replace(/\.(NS|BO|BSE|NSE)$/i, ''),
      pct: Number(d.changesPercentage != null ? d.changesPercentage : d.changePercentage),
    }));
  if (!list.length) return { gainers: [], losers: [] };
  const sorted = [...list].sort((a, b) => b.pct - a.pct);
  return {
    gainers: sorted.filter((x) => x.pct > 0).slice(0, 3),
    losers: sorted.filter((x) => x.pct < 0).slice(-3).reverse(),
  };
}

export async function getHeadlines() {
  const data = await getStable('/news/general', { page: '1', limit: '6' });
  const arr = Array.isArray(data) ? data : [];
  return arr
    .slice(0, 5)
    .map((n) => ({ title: n.title, url: n.url, time: n.publishedDate }))
    .filter((n) => n.title);
}

// Debug helper: returns the raw FMP "stable" responses so we can see why a
// section is empty (missing key, premium-only, or wrong symbol format).
export async function debugFmp() {
  const key = apiKey();
  const out = { hasKey: Boolean(key), endpoints: {} };
  const targets = {
    indices: '/quote?symbol=^BSESN,^NSEI,^NSEBANK',
    fx: '/forex/quote?symbol=USAINR',
    movers: '/quote?symbol=RELIANCE.NS,TCS.NS,HDFCBANK.NS',
    news: '/news/general?limit=3',
  };
  for (const [name, path] of Object.entries(targets)) {
    try {
      const sep = path.includes('?') ? '&' : '?';
      const res = await fetch(`${BASE}${path}${sep}apikey=${key}`);
      const text = await res.text();
      out.endpoints[name] = { status: res.status, body: text.slice(0, 500) };
    } catch (e) {
      out.endpoints[name] = { error: e.message };
    }
  }
  return out;
}
