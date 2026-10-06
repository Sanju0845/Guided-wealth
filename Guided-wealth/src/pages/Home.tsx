import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TESTIMONIALS, FAQS } from '../constants';
import { useAuth } from '../context/AuthContext';

/* All styles are scoped under .gw so they never leak into other pages */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Montserrat:wght@500;600&family=Nunito+Sans:wght@400;500;600&display=swap');
.gw{--bg:#050d1f;--bg2:#071531;--gold:#e0b15f;--gold2:#b98a3e;--tx:#e9eef8;--mut:rgba(222,232,248,.68);--line:rgba(224,177,95,.42);--cut:16px;--img:url('/assets/hero-lighthouse.webp')}
.gw *,.gw *::before,.gw *::after{box-sizing:border-box;margin:0;padding:0}
.gw{font-family:'Nunito Sans',system-ui,sans-serif;background:linear-gradient(180deg,#050d1f 0%,#07163a 30%,#061331 60%,#050e25 85%,#040a18 100%);color:var(--tx);line-height:1.6;overflow-x:hidden}
.gw h1,.gw h2,.gw h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;line-height:1.08}
.gw a{color:inherit;text-decoration:none}
.gw ul{list-style:none}
.gw :focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.gw .i{width:22px;height:22px;stroke:var(--gold);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex:none}
.gw .lab{font:500 .66rem 'Montserrat',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:var(--mut);display:flex;align-items:center;gap:14px;margin-bottom:12px}
.gw .lab:before{content:"";width:34px;height:1px;background:var(--gold)}
.gw .gold{background:linear-gradient(180deg,#f2d493,#d09f50);-webkit-background-clip:text;background-clip:text;color:transparent}
.gw em{font-style:italic;color:var(--gold)}
.gw .cut{--c:var(--cut);position:relative;padding:1px;background:linear-gradient(135deg,rgba(224,177,95,.75),rgba(224,177,95,.25) 50%,rgba(224,177,95,.6));clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c))}
.gw .cut>.in{height:100%;padding:26px 24px;background:linear-gradient(160deg,#0a1a3a,#06122b);clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c))}
.gw .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font:600 .66rem 'Montserrat',sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:11px 20px;border-radius:999px;border:1px solid var(--line);background:rgba(5,13,31,.5);color:var(--tx);cursor:pointer;transition:.25s}
.gw .btn:hover{border-color:var(--gold);transform:translateY(-2px)}
.gw .btn.g{background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;border-color:transparent}
.gw .btn.g:hover{box-shadow:0 8px 26px rgba(224,177,95,.35)}
.gw .btn.ch{border-radius:0;border:0;padding:0;background:none;clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)}
.gw .btn.ch span{display:flex;align-items:center;justify-content:center;gap:14px;height:58px;min-width:190px;padding:0 26px;text-align:center;line-height:1.5;border:1px solid var(--line);clip-path:inherit}
.gw .btn.ch.g span{border:0;background:linear-gradient(135deg,#f0cd85,#c9993f)}
.gw .stat{--c:var(--cut);flex:0 0 auto;display:flex;align-items:center;gap:12px;height:58px;padding:0 20px;background:linear-gradient(135deg,rgba(224,177,95,.75),rgba(224,177,95,.25) 50%,rgba(224,177,95,.6));clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c))}
.gw .stat>.in{display:flex;align-items:center;gap:12px;height:100%;padding:0 19px;background:linear-gradient(160deg,#0a1a3a,#06122b);clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c))}
.gw .stat b{font:600 1.8rem 'Cormorant Garamond',serif;color:var(--gold);line-height:1}
.gw .stat em{font-style:normal;font-size:.72rem;line-height:1.25;color:var(--mut)}
.gw .hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;padding:104px 6% 56px 8%}
.gw .hero:before{content:"";position:absolute;inset:0;z-index:0;background:linear-gradient(90deg,rgba(3,9,25,.8),rgba(3,9,25,.1) 62%),linear-gradient(rgba(8,28,80,.3),rgba(8,28,80,.3)),var(--img) 70% center/cover no-repeat;-webkit-mask-image:linear-gradient(180deg,#000 0%,#000 52%,rgba(0,0,0,.7) 66%,rgba(0,0,0,.4) 80%,rgba(0,0,0,.15) 92%,transparent 100%);mask-image:linear-gradient(180deg,#000 0%,#000 52%,rgba(0,0,0,.7) 66%,rgba(0,0,0,.4) 80%,rgba(0,0,0,.15) 92%,transparent 100%)}
.gw .hero-in{position:relative;z-index:2;max-width:720px}
.gw .hero h1{font-size:clamp(2.7rem,min(6.6vw,10.5vh),6rem);line-height:1.14;letter-spacing:.01em;text-shadow:0 2px 24px rgba(0,0,0,.5);padding-bottom:.08em}
.gw .hero h1 .gold{display:block;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;filter:drop-shadow(0 0 16px rgba(224,177,95,.35))}
.gw .hero .lead{margin:20px 0 24px;max-width:560px;font-size:1.05rem;line-height:1.65;color:#dfe8f7}
.gw .cta{display:flex;gap:14px;flex-wrap:wrap}
.gw .pgs{position:absolute;z-index:2;right:5.5%;top:46%;display:flex;flex-direction:column;gap:12px;padding-left:18px;border-left:1px solid var(--line);font:500 .66rem 'Montserrat',sans-serif;letter-spacing:.3em;color:var(--gold)}
.gw .pgs span:first-child{color:var(--mut)}
.gw section.s{padding:96px 6%;position:relative}
.gw .wrap{max-width:1180px;margin:0 auto}
.gw .c{text-align:center}
.gw .sec-t{font-size:clamp(2.2rem,4.4vw,3.3rem);margin-bottom:12px}
.gw .sub{color:var(--mut);max-width:560px}
.gw .c .sub{margin-inline:auto}
.gw .alt{background:none}
.gw .g3,.gw .g4{display:grid;gap:22px;margin-top:46px}
.gw .g3{grid-template-columns:repeat(3,1fr)}
.gw .g4{grid-template-columns:repeat(4,1fr)}
.gw .reg .in{display:block;text-align:left}
.gw .reg h3{display:flex;align-items:center;gap:14px;font-size:1.35rem;color:var(--gold);margin-bottom:14px}
.gw .reg p,.gw .stp p{color:var(--mut);font-size:.92rem}
.gw .stp .top{display:flex;justify-content:space-between;align-items:flex-start}
.gw .stp .n{font:500 2rem 'Cormorant Garamond',serif;color:var(--gold)}
.gw .stp h3{font-size:1.3rem;color:var(--gold);margin:14px 0 8px}
.gw .stp .i{width:26px;height:26px}
.gw .help{display:grid;grid-template-columns:1fr 1.05fr;gap:50px;align-items:center}
.gw .help .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:30px}
.gw .help .in{padding:20px 18px}
.gw .help h4{display:flex;align-items:center;gap:10px;font:600 .95rem 'Nunito Sans',sans-serif;color:var(--gold);margin-bottom:6px}
.gw .help p{color:var(--mut);font-size:.82rem}
.gw .qcard{--cut:26px;min-height:380px}
.gw .qcard .in{display:flex;flex-direction:column;justify-content:flex-start;padding:38px;min-height:380px;background:linear-gradient(180deg,rgba(5,13,31,.15) 40%,rgba(5,13,31,.75)),linear-gradient(rgba(8,28,80,.35),rgba(8,28,80,.35)),var(--img) 62% 45%/cover}
.gw .qcard q{font:italic 500 1.9rem/1.3 'Cormorant Garamond',serif;quotes:"“" "”";max-width:300px}
.gw .qcard small{margin-top:18px;font:500 .62rem 'Montserrat',sans-serif;letter-spacing:.28em;color:var(--gold);text-transform:uppercase}
.gw .feat{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin:34px 0 20px}
.gw .feat .in{padding:24px 22px}
.gw .feat .i{width:30px;height:30px;margin-bottom:14px}
.gw .feat p{font-size:.95rem;color:#dfe8f7;line-height:1.55}
.gw .band .in{display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap;padding:26px 34px}
.gw .sr{display:flex;flex-wrap:wrap}
.gw .sr>div{padding:0 38px}
.gw .sr>div:first-child{padding-left:0}
.gw .sr>div+div{border-left:1px solid var(--line)}
.gw .sr b{display:block;font:600 2.8rem 'Cormorant Garamond',serif;color:var(--gold);line-height:1}
.gw .sr span{font-size:.78rem;color:var(--mut)}
.gw .marq{margin:38px -6% 0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.gw .tr{display:flex;gap:22px;width:max-content;animation:roll 40s linear infinite}
.gw .marq:hover .tr{animation-play-state:paused}
.gw .tr .cut{flex:0 0 360px}
.gw .tr p{font:italic .92rem 'Nunito Sans',sans-serif;color:var(--tx);margin-bottom:18px}
.gw .who{display:flex;align-items:center;gap:12px}
.gw .av{width:42px;height:42px;border-radius:50%;border:1px solid var(--gold);display:grid;place-items:center;font-size:.8rem;color:var(--gold);flex:none}
.gw .who b{display:block;font-size:.88rem}
.gw .who small{color:var(--mut);font-size:.74rem}
.gw .st{color:var(--gold);font-size:.8rem;letter-spacing:2px}
@keyframes roll{to{transform:translateX(calc(-50% - 11px))}}
.gw .faq{display:grid;grid-template-columns:1fr;gap:32px;align-items:start}
.gw details{border-bottom:1px solid rgba(224,177,95,.25)}
.gw summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;padding:14px 0;font-size:.9rem}
.gw summary::-webkit-details-marker{display:none}
.gw summary:after{content:"+";color:var(--gold);font-size:1.2rem;transition:.25s}
.gw details[open] summary:after{transform:rotate(45deg)}
.gw details p{color:var(--mut);font-size:.88rem;padding-bottom:14px}
@media(max-width:1000px){.gw .g4{grid-template-columns:1fr 1fr}
.gw .help,.gw .faq{grid-template-columns:1fr}
.gw .feat{grid-template-columns:1fr 1fr}
.gw .pgs{display:none}
.gw .band .in{justify-content:center}
}
@media(max-width:640px){.gw .g3,.gw .g4,.gw .help .g2,.gw .feat{grid-template-columns:1fr}
.gw .tr .cut{flex-basis:300px}
.gw .btn.ch,.gw .btn.ch span{width:100%}
.gw .cta{display:grid;grid-template-columns:1fr 1fr}
.gw .btn.ch span{min-width:0;padding:0 12px}
.gw .stat{width:100%;padding:0 12px}
.gw .stat>.in{padding:0 11px}
.gw .sr>div{padding:0 16px}
.gw .sr b{font-size:2.2rem}
.gw .hero:before{background:linear-gradient(180deg,rgba(3,9,25,.6),rgba(3,9,25,.2) 40%,rgba(3,9,25,.85)),url('/assets/bgmobile.webp') center/cover no-repeat}
}
@media(prefers-reduced-motion:reduce){.gw .tr{animation:none}
}
.gw h1,.gw h2,.gw h3{text-transform:none}
`;

const Icon = ({ id }: { id: string }) => (
  <svg className="i" aria-hidden="true">
    <use href={`#gw-${id}`} />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal } = useAuth();

  const handleProtectedAction = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      openLoginModal();
    }
  };

  const testimonialsDoubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="gw">
      <style>{css}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="gw-shield" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></symbol>
        <symbol id="gw-cert" viewBox="0 0 24 24"><path d="M5 3h14v13l-7 5-7-5z" /><circle cx="12" cy="9" r="3" /></symbol>
        <symbol id="gw-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3 0 5 2 5 5" /></symbol>
        <symbol id="gw-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></symbol>
        <symbol id="gw-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 12l7-7" /></symbol>
        <symbol id="gw-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></symbol>
        <symbol id="gw-chart" viewBox="0 0 24 24"><path d="M4 20h16M6 16l4-5 3 3 5-7" /><path d="M15 7h3v3" /></symbol>
        <symbol id="gw-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" /></symbol>
        <symbol id="gw-house" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9H3z" /><path d="M10 20v-6h4v6" /></symbol>
        <symbol id="gw-brief" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3" /></symbol>
        <symbol id="gw-coin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" /></symbol>
      </svg>

      <main id="home">
        {/* Hero */}
        <section className="hero">
          <div className="hero-in">
            <div className="lab">Trusted Financial Planning</div>
            <h1>
              <span className="gold">Guiding Lights</span>
              By Your
              <br />
              Investment
            </h1>
            <p className="lead">
              Every individual plans their financial life as per their understanding. What matters is personalizing
              that knowledge to your unique situation.
            </p>
            <div className="cta">
              <button className="btn ch g" onClick={() => handleProtectedAction('/retirement-analysis')}>
                <span>
                  Retirement &amp; Goal
                  <br />
                  Calculator →
                </span>
              </button>
              <button className="btn ch" onClick={() => handleProtectedAction('/assessment')}>
                <span>
                  Risk Profile
                  <br />
                  Evaluation →
                </span>
              </button>
              <div className="stat"><div className="in"><b>10+</b><em>Yrs<br />Exp</em></div></div>
              <div className="stat"><div className="in"><b>500+</b><em>Clients<br />Guided</em></div></div>
            </div>
          </div>
          <div className="pgs" aria-hidden="true">
            <span>PLAN</span>
            <span style={{ color: 'var(--gold)' }}>GROW</span>
            <span style={{ color: 'var(--gold)' }}>SECURE</span>
          </div>
        </section>

        {/* Regulatory compliance */}
        <section className="s c" id="credentials">
          <div className="wrap">
            <h2 className="sec-t">Regulatory compliance</h2>
            <p className="sub">Your trust is backed by ethics, certificates and industry standards.</p>
            <div className="g3 reg">
              <div className="cut"><div className="in"><h3><Icon id="shield" />Ex Banker</h3><p>Our team includes professionals with extensive banking experience, bringing deep market insight and trusted expertise.</p></div></div>
              <div className="cut"><div className="in"><h3><Icon id="cert" />NISM Certified</h3><p>Certified by the National Institute of Securities Markets, ensuring adherence to the highest standards in financial advisory.</p></div></div>
              <div className="cut"><div className="in"><h3><Icon id="users" />XIMB Alumni</h3><p>Backed by alumni from Xavier Institute of Management, we bring a strong foundation in business and finance.</p></div></div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="s alt" id="process">
          <div className="wrap">
            <div className="lab">Our proven process</div>
            <h2 className="sec-t">Our proven <em>process</em></h2>
            <p className="sub">A systematic approach to helping you achieve your wealth management goals.</p>
            <div className="g4 stp">
              {[
                { n: '01', icon: 'search', t: 'Discovery', d: 'We begin by understanding your financial goals, risk appetite and future needs.' },
                { n: '02', icon: 'target', t: 'Strategy', d: 'We create a personalized financial plan tailored to your unique situation.' },
                { n: '03', icon: 'gear', t: 'Implementation', d: 'We execute with care, selecting the right products and solutions.' },
                { n: '04', icon: 'chart', t: 'Monitoring', d: 'Continuous review and adjustments to keep you on track.' },
              ].map((s) => (
                <div className="cut" key={s.n}>
                  <div className="in">
                    <div className="top"><span className="n">{s.n}</span><Icon id={s.icon} /></div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who we help */}
        <section className="s">
          <div className="wrap help">
            <div>
              <div className="lab">Who we help</div>
              <h2 className="sec-t">We help people at <em>every stage of life</em></h2>
              <p className="sub">Whether you're starting, growing, or protecting your wealth, we're here for you.</p>
              <div className="g2">
                {[
                  { icon: 'user', t: 'Young Professionals', d: 'Build a strong financial foundation for your future.' },
                  { icon: 'house', t: 'Growing Families', d: "Plan for your family's security and long-term goals." },
                  { icon: 'brief', t: 'Business Owners', d: 'Protect and grow your business wealth with smart strategies.' },
                  { icon: 'coin', t: 'Pre-Retirees', d: 'Create a steady income and financial freedom for tomorrow.' },
                ].map((c) => (
                  <div className="cut" key={c.t}>
                    <div className="in"><h4><Icon id={c.icon} />{c.t}</h4><p>{c.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cut qcard">
              <div className="in">
                <q>A plan only works when it fits the person holding it.</q>
                <small>Your goals. Our guidance.</small>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section className="s" id="why">
          <div className="wrap">
            <div className="lab">Why choose</div>
            <h2 className="sec-t">Guided Wealthy?</h2>
            <div className="feat">
              <div className="cut"><div className="in"><Icon id="target" /><p>Personalized financial planning based on your unique goals.</p></div></div>
              <div className="cut"><div className="in"><Icon id="users" /><p>Experienced team with deep industry knowledge.</p></div></div>
              <div className="cut"><div className="in"><Icon id="shield" /><p>Transparent, client-first approach.</p></div></div>
              <div className="cut"><div className="in"><Icon id="chart" /><p>Long-term relationship and ongoing support.</p></div></div>
            </div>
            <div className="cut band">
              <div className="in">
                <div className="sr">
                  <div><b>15+</b><span>Years of Experience</span></div>
                  <div><b>500+</b><span>Happy Clients</span></div>
                  <div><b>98%</b><span>Client Retention Rate</span></div>
                </div>
                <Link to="/booking" className="btn g">Let's build your financial legacy →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (auto-scroll) */}
        <section className="s" id="stories" style={{ overflow: 'hidden' }}>
          <div className="wrap">
            <div className="lab">What our clients say</div>
            <h2 className="sec-t">Real people. Real stories.</h2>
            <p className="sub">Here's what our clients have to say about their experience with Guided Wealthy.</p>
          </div>
          <div className="marq">
            <div className="tr">
              {testimonialsDoubled.map((t: any, idx: number) => (
                <div className="cut" key={`${t.id}-${idx}`}>
                  <div className="in">
                    <p>“{t.content}”</p>
                    <div className="who">
                      <span className="av">{t.name.split(' ').map((n: string) => n[0]).join('')}</span>
                      <div>
                        <b>{t.name}</b>
                        <small>{t.role}</small>
                        <div className="st">★★★★★</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="s alt" id="faq">
          <div className="wrap faq">
            <div>
              <div className="lab">Frequently asked</div>
              <h2 className="sec-t">Frequently asked questions</h2>
            </div>
            <div>
              {FAQS.map((faq: any, idx: number) => (
                <details key={idx}>
                  <summary>{faq.question}</summary>
                  <p style={{ whiteSpace: 'pre-line' }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}