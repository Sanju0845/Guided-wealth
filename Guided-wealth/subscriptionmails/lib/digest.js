// Assembles the weekly market digest from FMP data. Every source is optional —
// if a fetch returns nothing, that section is simply left out of the email.
import { getMarketOverview, getMovers, getHeadlines } from './fmp.js';

export async function buildDigest() {
  const [overview, movers, headlines] = await Promise.all([
    getMarketOverview().catch(() => []),
    getMovers().catch(() => ({ gainers: [], losers: [] })),
    getHeadlines().catch(() => []),
  ]);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const indices = (overview || []).filter((r) => r.label !== 'USD/INR');
  const avg = indices.length
    ? indices.reduce((s, r) => s + (r.changePct || 0), 0) / indices.length
    : 0;
  const sentiment = avg > 0.15 ? 'Positive' : avg < -0.15 ? 'Negative' : 'Mixed';

  return {
    dateLabel,
    sentiment,
    overview: overview || [],
    movers: movers || { gainers: [], losers: [] },
    headlines: headlines || [],
    summary: buildSummary(overview || [], sentiment),
  };
}

// Plain-language "what's happening" line — no AI/provider needed.
function buildSummary(overview, sentiment) {
  const indices = overview.filter((r) => r.label !== 'USD/INR');
  if (!indices.length) return '';
  const parts = indices.map(
    (r) => `${r.label} ${r.changePct >= 0 ? '+' : ''}${(r.changePct || 0).toFixed(2)}%`
  );
  const fx = overview.find((r) => r.label === 'USD/INR');
  const fxTxt = fx ? `, USD/INR at ${fx.level.toFixed(2)}` : '';
  return `Indian markets closed ${sentiment.toLowerCase()} this week — ${parts.join(
    ', '
  )}${fxTxt}. The move was driven broadly by ${sentiment === 'Negative' ? 'selling pressure across large-caps' : 'buying interest in banking and large-caps'}.`;
}
