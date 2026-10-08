// Renders the digest into a clean, professional, inline-CSS HTML email
// (Gmail-safe). Mirrors the Capital Advantage layout: greeting + date/sentiment,
// Market Overview, Market Movers, Headlines, What's happening, footer + unsubscribe.

const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const pct = (n) => `${n >= 0 ? '+' : ''}${(n || 0).toFixed(2)}%`;
const col = (n) => (n >= 0 ? '#16a34a' : '#dc2626');

export function renderDigestHtml(digest, email) {
  const { dateLabel, sentiment, overview, movers, headlines, summary } = digest;
  const site = process.env.NEWSLETTER_SITE_URL || 'https://guided-wealthy.vercel.app';
  const unsubLink = `${site}/api/unsubscribe${email ? `?email=${encodeURIComponent(email)}` : ''}`;
  const badge = sentiment === 'Positive' ? '#16a34a' : sentiment === 'Negative' ? '#dc2626' : '#c9993f';

  const overviewRows = overview
    .map(
      (r) => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid #eee;font-weight:700;color:#111">${esc(r.label)}</td>
        <td style="padding:9px 0;border-bottom:1px solid #eee;text-align:right;color:#333">${fmt(r.level)}</td>
        <td style="padding:9px 0;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:${col(r.changePct)}">${pct(r.changePct)}</td>
      </tr>`
    )
    .join('');

  const moverRow = (m) => `
      <tr>
        <td style="padding:6px 0;color:#111">${esc(m.symbol)}</td>
        <td style="padding:6px 0;text-align:right;font-weight:700;color:${col(m.pct)}">${pct(m.pct)}</td>
      </tr>`;

  const gainers = (movers.gainers || []).map(moverRow).join('');
  const losers = (movers.losers || []).map(moverRow).join('');

  const headlineItems = (headlines || [])
    .map(
      (h) => `<li style="margin:0 0 10px;line-height:1.5"><a href="${esc(h.url)}" style="color:#111;text-decoration:none">${esc(h.title)}</a></li>`
    )
    .join('');

  const hasOverview = overview.length > 0;
  const hasMovers = gainers || losers;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee">
        <tr><td style="background:#0c1c40;padding:26px 30px">
          <div style="color:#e0b15f;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Guided Wealthy</div>
          <div style="color:#fff;font-size:24px;font-weight:bold;margin-top:6px">Market Brief</div>
        </td></tr>

        <tr><td style="padding:26px 30px">
          <p style="margin:0 0 6px;color:#111;font-size:15px">Good day, here is your Guided Wealthy market brief.</p>
          <p style="margin:0 0 18px;color:#666;font-size:13px">${esc(dateLabel)}
            <span style="display:inline-block;margin-left:8px;padding:2px 10px;border-radius:999px;background:${badge};color:#fff;font-size:11px;font-weight:bold;text-transform:uppercase">${esc(sentiment)}</span>
          </p>

          ${hasOverview ? `
          <h3 style="margin:0 0 8px;color:#c9993f;font-size:13px;letter-spacing:1px;text-transform:uppercase">Market Overview</h3>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">
            <tr><td style="padding:4px 0;font-size:11px;color:#999;text-transform:uppercase">Index</td>
                <td style="padding:4px 0;font-size:11px;color:#999;text-align:right;text-transform:uppercase">Level</td>
                <td style="padding:4px 0;font-size:11px;color:#999;text-align:right;text-transform:uppercase">Change</td></tr>
            ${overviewRows}
          </table>` : ''}

          ${hasMovers ? `
          <h3 style="margin:0 0 8px;color:#c9993f;font-size:13px;letter-spacing:1px;text-transform:uppercase">Market Movers</h3>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">
            ${gainers ? `<tr><td colspan="2" style="padding:6px 0;color:#16a34a;font-weight:bold;font-size:12px">TOP GAINERS</td></tr>${gainers ? `<tr><td colspan="2"><table width="100%">${gainers}</table></td></tr>` : ''}` : ''}
            ${losers ? `<tr><td colspan="2" style="padding:10px 0 6px;color:#dc2626;font-weight:bold;font-size:12px">TOP LOSERS</td></tr><tr><td colspan="2"><table width="100%">${losers}</table></td></tr>` : ''}
          </table>` : ''}

          ${summary ? `
          <h3 style="margin:0 0 8px;color:#c9993f;font-size:13px;letter-spacing:1px;text-transform:uppercase">What's Happening?</h3>
          <p style="margin:0 0 22px;color:#333;font-size:14px;line-height:1.6">${esc(summary)}</p>` : ''}

          ${headlineItems ? `
          <h3 style="margin:0 0 8px;color:#c9993f;font-size:13px;letter-spacing:1px;text-transform:uppercase">Headlines</h3>
          <ul style="margin:0 0 8px;padding-left:18px;color:#333;font-size:14px">${headlineItems}</ul>` : ''}
        </td></tr>

        <tr><td style="padding:20px 30px;border-top:1px solid #eee;background:#fafafa">
          <p style="margin:0 0 8px;color:#666;font-size:12px;line-height:1.6">
            You're receiving this because you subscribed to Guided Wealthy market updates.
            <a href="${unsubLink}" style="color:#c9993f">Unsubscribe</a>.
          </p>
          <p style="margin:0;color:#999;font-size:11px;line-height:1.5">
            Disclaimer: Investments in financial markets are subject to market risks. This email is for
            information only and is not investment advice. Please read all scheme-related documents carefully.
          </p>
          <p style="margin:10px 0 0;color:#999;font-size:11px">© ${new Date().getFullYear()} Guided Wealthy · SEBI Registered Investment Advisor</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderWelcomeHtml() {
  const site = process.env.NEWSLETTER_SITE_URL || 'https://guided-wealthy.vercel.app';
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee">
        <tr><td style="background:#0c1c40;padding:28px 30px">
          <div style="color:#e0b15f;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Guided Wealthy</div>
          <div style="color:#fff;font-size:24px;font-weight:bold;margin-top:6px">You're subscribed</div>
        </td></tr>
        <tr><td style="padding:28px 30px">
          <p style="margin:0 0 14px;color:#111;font-size:16px;line-height:1.6">Thanks for subscribing to the <strong>Guided Wealthy</strong> market brief.</p>
          <p style="margin:0 0 14px;color:#333;font-size:14px;line-height:1.6">Every week you'll get a clean snapshot of the market — key indices, top movers, institutional activity and the headlines that matter — so you can make informed decisions with confidence.</p>
          <p style="margin:0 0 22px;color:#333;font-size:14px">Your first brief is on its way. Meanwhile, explore our tools:</p>
          <p style="margin:0">
            <a href="${site}/calculators" style="display:inline-block;background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;text-decoration:none;font-weight:bold;font-size:13px;padding:12px 22px;border-radius:999px">Try the calculators</a>
          </p>
        </td></tr>
        <tr><td style="padding:20px 30px;border-top:1px solid #eee;background:#fafafa">
          <p style="margin:0 0 8px;color:#666;font-size:12px">Changed your mind? <a href="${site}/api/unsubscribe" style="color:#c9993f">Unsubscribe</a>.</p>
          <p style="margin:0;color:#999;font-size:11px;line-height:1.5">Disclaimer: Investments in financial markets are subject to market risks. This email is for information only and is not investment advice.</p>
          <p style="margin:10px 0 0;color:#999;font-size:11px">© ${new Date().getFullYear()} Guided Wealthy · SEBI Registered Investment Advisor</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
