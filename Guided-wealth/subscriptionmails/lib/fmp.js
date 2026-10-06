// Financial Modeling Prep helpers (free tier). Every call is independent and
// returns null/[] on any failure, so a missing key or an unavailable symbol never
// breaks the digest — that section is simply omitted from the email.
//
// NOTE: FMP symbol formats can change. Defaults target India (NSE/BSE). If a
// section comes back empty, tweak the symbols via env (FMP_INDEX_SYMBOLS,
// FMP_WATCH_SYMBOLS) — no code change needed.
const BASE = 'https://financialmodelingprep.com/api/v3';

const apiKey = () => process.env.FMP_API_KEY;

async function getJson(pathWithQuery) {
  if (!apiKey()) return null;
  try {
    const sep = pathWithQuery.includes('?') ? '&' : '?';
    const res = await fetch(`${BASE}${pathWithQuery}${sep}apikey=${apiKey()}`);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.includes('"error"')) return null;
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

async function getFxUsdInr() {
  const data = await getJson('/fx/quote/USAINR');
  const d = Array.isArray(data) ? data[0] : data;
  if (!d || d.price == null) return null;
  return { label: 'USD/INR', level: Number(d.price), changePct: Number(d.changesPercentage || 0) };
}

export async function getMarketOverview() {
  const items = parseIndexSymbols();
  const symbols = items.map((i) => i.symbol).join(',');
  const data = await getJson(`/quote/${symbols}`);
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

export async function getMovers() {
  const raw =
    process.env.FMP_WATCH_SYMBOLS ||
    'RELIANCE.NS,TCS.NS,HDFCBANK.NS,ICICIBANK.NS,INFY.NS,SBIN.NS,BHARTIARTL.NS,ITC.NS,HINDUNILVR.NS,KOTAKBANK.NS,AXISBANK.NS,LT.NS,BAJFINANCE.NS,M&M.NS,ASIANPAINT.NS,SUNPHARMA.NS,TATAMOTORS.NS,TATASTEEL.NS,JSWSTEEL.NS,HCLTECH.NS';
  const symbols = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const data = await getJson(`/quote/${symbols.join(',')}`);
  const list = (Array.isArray(data) ? data : [])
    .filter((d) => d && d.price != null && d.changesPercentage != null)
    .map((d) => ({ symbol: String(d.symbol).replace(/\.(NS|BO|BSE)$/i, ''), pct: Number(d.changesPercentage) }));
  if (!list.length) return { gainers: [], losers: [] };
  const sorted = [...list].sort((a, b) => b.pct - a.pct);
  return {
    gainers: sorted.filter((x) => x.pct > 0).slice(0, 3),
    losers: sorted.filter((x) => x.pct < 0).slice(-3).reverse(),
  };
}

export async function getHeadlines() {
  const data = await getJson('/news/stock/general/popular?limit=6');
  const arr = Array.isArray(data) ? data : [];
  return arr
    .slice(0, 5)
    .map((n) => ({ title: n.title, url: n.url, time: n.publishedDate }))
    .filter((n) => n.title);
}

// Debug helper: returns the raw FMP responses so we can see why a section is empty
// (missing key, premium-only endpoint, or wrong symbol format).
export async function debugFmp() {
  const key = apiKey();
  const out = { hasKey: Boolean(key), endpoints: {} };
  const targets = {
    indices: '/quote/^BSESN,^NSEI,^NSEBANK',
    fx: '/fx/quote/USAINR',
    movers: '/quote/RELIANCE.NS,TCS.NS,HDFCBANK.NS',
    news: '/news/stock/general/popular?limit=3',
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
