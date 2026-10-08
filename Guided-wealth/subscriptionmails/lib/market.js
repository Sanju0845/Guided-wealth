// Market data source — Yahoo Finance (public chart endpoint, no key) + RSS headlines.
// Replaces Financial Modeling Prep, whose free tier does not cover Indian indices.
// Every call is independent and returns null/[] on failure, so a blocked symbol
// never breaks the digest — the section is simply omitted.
//
// Symbols are env-overridable: YAHOO_INDEX_MAP, YAHOO_WATCH_SYMBOLS, NEWS_RSS_URL

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; GuidedWealthyBot/1.0)' };

async function yahooChart(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) return null;
    const j = await res.json();
    const r = j && j.chart && j.chart.result && j.chart.result[0];
    if (!r || !r.meta) return null;
    const price = r.meta.regularMarketPrice;
    const prev = r.meta.chartPreviousClose != null ? r.meta.chartPreviousClose : r.meta.previousClose;
    if (price == null || prev == null || prev === 0) return null;
    return { symbol, price: Number(price), pct: ((Number(price) - Number(prev)) / Number(prev)) * 100 };
  } catch {
    return null;
  }
}

function indexMap() {
  const raw =
    process.env.YAHOO_INDEX_MAP ||
    'SENSEX:^BSESN,NIFTY 50:^NSEI,NIFTY BANK:^NSEBANK,USD/INR:INR=X';
  return raw
    .split(',')
    .map((pair) => {
      const [label, symbol] = pair.split(':');
      return { label: (label || '').trim(), symbol: (symbol || '').trim() };
    })
    .filter((x) => x.label && x.symbol);
}

export async function getMarketOverview() {
  const items = indexMap();
  const results = await Promise.all(items.map((i) => yahooChart(i.symbol)));
  return items
    .map((i, idx) => {
      const d = results[idx];
      if (!d) return null;
      return { label: i.label, level: d.price, changePct: d.pct };
    })
    .filter(Boolean);
}

export async function getMovers() {
  const raw =
    process.env.YAHOO_WATCH_SYMBOLS ||
    'RELIANCE.NS,TCS.NS,HDFCBANK.NS,ICICIBANK.NS,INFY.NS,SBIN.NS,BHARTIARTL.NS,ITC.NS,HINDUNILVR.NS,KOTAKBANK.NS,AXISBANK.NS,LT.NS,BAJFINANCE.NS,M&M.NS,ASIANPAINT.NS,SUNPHARMA.NS,TATAMOTORS.NS,TATASTEEL.NS,JSWSTEEL.NS,HCLTECH.NS';
  const symbols = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const results = (await Promise.all(symbols.map((s) => yahooChart(s)))).filter(Boolean);
  const list = results.map((d) => ({ symbol: d.symbol.replace(/\.(NS|BO)$/i, ''), pct: d.pct }));
  if (!list.length) return { gainers: [], losers: [] };
  const sorted = [...list].sort((a, b) => b.pct - a.pct);
  return {
    gainers: sorted.filter((x) => x.pct > 0).slice(0, 3),
    losers: sorted.filter((x) => x.pct < 0).slice(-3).reverse(),
  };
}

function cleanTitle(t) {
  return String(t || '')
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export async function getHeadlines() {
  const url =
    process.env.NEWS_RSS_URL ||
    'https://news.google.com/rss/search?q=NSE+Sensex+Nifty+stock+market&hl=en-IN&gl=IN&ceid=IN:en';
  try {
    const res = await fetch(url, { headers: UA });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const re = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) && items.length < 5) {
      const block = m[1];
      const title = cleanTitle((block.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
      const link = ((block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (title) items.push({ title, url: link });
    }
    return items;
  } catch {
    return [];
  }
}

// Debug helper: shows raw status from Yahoo + RSS so we can confirm they work
// from Vercel's (datacenter) IP before trusting the digest.
export async function debugFmp() {
  const out = { yahoo: {}, rss: {} };
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=1d';
    const res = await fetch(url, { headers: UA });
    const text = await res.text();
    out.yahoo.nifty = { status: res.status, sample: text.slice(0, 300) };
  } catch (e) {
    out.yahoo.nifty = { error: e.message };
  }
  try {
    const res = await fetch('https://news.google.com/rss/search?q=NSE+Sensex+Nifty+stock+market&hl=en-IN&gl=IN&ceid=IN:en', { headers: UA });
    const text = await res.text();
    out.rss.googleNews = { status: res.status, hasItems: /<item/.test(text), sample: text.slice(0, 200) };
  } catch (e) {
    out.rss.googleNews = { error: e.message };
  }
  return out;
}
