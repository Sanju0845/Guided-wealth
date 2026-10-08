import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import axios from 'axios';

/* Post-login newsletter prompt (option B). Shows a dismissible bottom banner to
   logged-in users who haven't subscribed yet, and posts to /api/subscribe.
   Self-contained: no auth changes, remembers dismissal in localStorage. */
const KEY = 'gw_newsletter_prompt_done';

const css = `
.gwp{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:60;width:min(680px,94%);font-family:'Nunito Sans',system-ui,sans-serif}
.gwp-card{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:16px 18px;border-radius:16px;border:1px solid rgba(224,177,95,.42);background:rgba(12,28,64,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 16px 44px rgba(0,0,0,.4)}
.gwp-txt{flex:1 1 220px;display:flex;flex-direction:column;gap:2px}
.gwp-txt b{color:#f2d493;font-size:.98rem}
.gwp-txt span{color:rgba(222,232,248,.7);font-size:.82rem}
.gwp form{display:flex;gap:8px;flex:1 1 260px}
.gwp input[type=email]{flex:1 1 150px;padding:11px 15px;border-radius:999px;border:1px solid rgba(224,177,95,.42);background:rgba(4,10,24,.6);color:#e9eef8;font:inherit;font-size:.88rem}
.gwp input[type=email]:focus{outline:2px solid #e0b15f;outline-offset:2px}
.gwp button[type=submit]{padding:11px 20px;border-radius:999px;border:0;cursor:pointer;font:600 .72rem 'Montserrat',sans-serif;letter-spacing:.08em;text-transform:uppercase;background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;white-space:nowrap}
.gwp button[type=submit]:disabled{opacity:.6;cursor:default}
.gwp-x{background:none;border:0;color:rgba(222,232,248,.6);font-size:1rem;cursor:pointer;padding:4px 6px;line-height:1}
.gwp-x:hover{color:#fff}
.gwp-msg{margin-top:6px;text-align:center;font-size:.78rem;color:#f2d493}
`;

export default function EmailPrompt() {
  const { isLoggedIn } = useAuth();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isLoggedIn || dismissed) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setMsg('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post('/api/subscribe', { email: clean, consent: true, source: 'post-login' });
      setMsg(res.data?.message || 'Subscribed! Check your inbox.');
      setTimeout(close, 2600);
    } catch (err: any) {
      setMsg(err?.response?.data?.message || 'Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gwp">
      <style>{css}</style>
      <div className="gwp-card">
        <div className="gwp-txt">
          <b>Get weekly market briefs</b>
          <span>Add your email for Guided Wealthy&rsquo;s market &amp; SEBI updates.</span>
        </div>
        <form onSubmit={submit} noValidate>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Subscribe'}
          </button>
        </form>
        <button className="gwp-x" onClick={close} aria-label="Dismiss">
          ✕
        </button>
      </div>
      {msg && <div className="gwp-msg">{msg}</div>}
    </div>
  );
}
