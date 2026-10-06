import React from 'react';
import { Link } from 'react-router-dom';
import SubscribeForm from '../../subscriptionmails/SubscribeForm';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600&display=swap');
.gwf{--gold:#e0b15f;--mut:rgba(222,232,248,.68);--line:rgba(224,177,95,.42);font-family:'Nunito Sans',system-ui,sans-serif;background:#040a18;color:#e9eef8;border-top:1px solid rgba(224,177,95,.2);padding:40px 6% 18px;line-height:1.6}
.gwf *{box-sizing:border-box}
.gwf a{color:inherit;text-decoration:none}
.gwf ul{list-style:none;margin:0;padding:0}
.gwf .fg{display:grid;grid-template-columns:1.3fr .8fr 1.4fr;gap:34px;max-width:1020px;margin:0 auto;padding-bottom:26px}
.gwf .fg>div+div{border-left:1px solid var(--line);padding-left:34px}
.gwf h5{font:600 1.05rem 'Nunito Sans',sans-serif;color:var(--gold);margin:0 0 14px}
.gwf li,.gwf p{color:var(--mut);font-size:.92rem;margin:0 0 8px;line-height:1.55}
.gwf a:hover{color:var(--gold)}
.gwf .soc{display:flex;gap:10px;margin-top:14px}
.gwf .soc a{width:32px;height:32px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;font-size:.78rem;color:var(--gold)}
.gwf .copy{display:flex;justify-content:space-between;max-width:1020px;margin:0 auto;padding-top:16px;border-top:1px solid rgba(224,177,95,.15);font-size:.8rem;color:var(--mut)}
@media(max-width:640px){.gwf .fg{grid-template-columns:1fr}.gwf .fg>div+div{border:0;padding:0}.gwf .copy{flex-direction:column;gap:6px}}
`;

export default function Footer() {
  return (
    <footer className="gwf">
      <style>{css}</style>
      <div className="fg">
        <div>
          <img src="/assets/logo.png" alt="Guided Wealthy" style={{ height: 44 }} referrerPolicy="no-referrer" />
          <p style={{ marginTop: 10 }}>Empowering your financial future with trust, expertise and personalized guidance.</p>
          <div className="soc">
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        <div>
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/booking">Book Appointment</Link></li>
          </ul>
        </div>
        <div>
          <h5>Contact Us</h5>
          <ul>
            <li>✉ guidedwealthy@gmail.com</li>
            <li>☎ +91 95865 9876</li>
            <li>⌖ 8th Floor, 42, Vasanth, MG Road, Bengaluru, Karnataka - 560001</li>
          </ul>
        </div>
      </div>
      <SubscribeForm />
      <div className="copy">
        <span>© 2025 Guided Wealthy. All rights reserved.</span>
        <span><Link to="/privacy-policy">Privacy Policy</Link> &nbsp;&nbsp; <Link to="/legal">Terms &amp; Conditions</Link></span>
      </div>
    </footer>
  );
}