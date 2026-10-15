import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchPosts,
  postImage,
  postCategories,
  formatDate,
  htmlToText,
  wpEnabled,
  type WPPost,
} from '../lib/wp';

/* Styles scoped under .gwb — mirrors the Home page palette & type */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@500;600&family=Nunito+Sans:wght@400;500;600&display=swap');
.gwb{--bg:#fdfaf4;--white:#ffffff;--navy:#0b1f4d;--gold:#b98a3e;--gold2:#d6a753;--tx:#34425f;--mut:#5f6b85;--line:rgba(185,138,62,.5);--cut:16px;
font-family:'Nunito Sans',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.6}
.gwb *,.gwb *::before,.gwb *::after{box-sizing:border-box;margin:0;padding:0}
.gwb a{color:inherit;text-decoration:none}
.gwb .wrap{max-width:1120px;margin:0 auto;padding:120px 6% 80px}
.gwb .lab{font:500 .68rem 'Montserrat',sans-serif;letter-spacing:.3em;text-transform:uppercase;color:var(--mut);display:flex;align-items:center;gap:14px;margin-bottom:14px}
.gwb .lab:before{content:"";width:50px;height:1px;background:var(--gold)}
.gwb h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:clamp(2.3rem,5vw,3.6rem);line-height:1.08;color:var(--navy)}
.gwb .gold{background:linear-gradient(180deg,#c9993f,#d9a94f 55%,#b98a3e);-webkit-background-clip:text;background-clip:text;color:transparent}
.gwb .sub{margin:16px 0 44px;max-width:560px;color:var(--mut);font-size:1.02rem}

.gwb .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:26px}
.gwb .cut{--c:var(--cut);position:relative;padding:1px;background:linear-gradient(135deg,rgba(201,153,63,.9),rgba(201,153,63,.35) 50%,rgba(201,153,63,.8));clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c));transition:transform .25s}
.gwb .cut:hover{transform:translateY(-4px)}
.gwb .in{height:100%;background:linear-gradient(160deg,#ffffff,#fffaf0);clip-path:polygon(var(--c) 0,100% 0,100% calc(100% - var(--c)),calc(100% - var(--c)) 100%,0 100%,0 var(--c));display:flex;flex-direction:column}
.gwb .thumb{aspect-ratio:16/9;background:linear-gradient(135deg,#0b1f4d,#1c3a6e);background-size:cover;background-position:center}
.gwb .body{padding:22px 22px 26px;display:flex;flex-direction:column;gap:10px;flex:1}
.gwb .meta{display:flex;align-items:center;gap:10px;font:600 .64rem 'Montserrat',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.gwb .meta .dot{width:4px;height:4px;border-radius:50%;background:var(--line)}
.gwb .meta time{color:var(--mut)}
.gwb h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:1.42rem;line-height:1.2;color:var(--navy)}
.gwb .exc{color:var(--mut);font-size:.94rem;flex:1}
.gwb .more{margin-top:6px;font:600 .7rem 'Montserrat',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);display:inline-flex;gap:8px;align-items:center}
.gwb .more:hover{color:var(--gold)}

.gwb .sk{background:#efe7d8;border-radius:2px;animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
.gwb .note{margin-top:40px;padding:22px 24px;border:1px dashed var(--line);border-radius:12px;background:#fffaf0;color:var(--mut);font-size:.92rem}
.gwb .note b{color:var(--navy)}
`;

export default function Blog() {
  const [posts, setPosts] = useState<WPPost[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPosts().then((p) => { if (alive) setPosts(p); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="gwb">
      <style>{css}</style>
      <div className="wrap">
        <div className="lab">Guided Wealthy · Blog</div>
        <h1>Insights to grow your <span className="gold">wealth</span> wisely</h1>
        <p className="sub">Practical guides, market perspectives and planning ideas from our advisory team.</p>

        {posts === null ? (
          <div className="grid" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="cut" key={i}>
                <div className="in">
                  <div className="sk" style={{ aspectRatio: '16/9' }} />
                  <div className="body">
                    <div className="sk" style={{ height: 12, width: '40%' }} />
                    <div className="sk" style={{ height: 22, width: '90%' }} />
                    <div className="sk" style={{ height: 12, width: '100%' }} />
                    <div className="sk" style={{ height: 12, width: '80%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="note">
            {wpEnabled()
              ? <>No posts are live yet. Publish your first article in the WordPress dashboard and it will appear here automatically.</>
              : <>Blog is not connected yet. Set <b>VITE_WP_API_URL</b> in the environment to link a WordPress site.</>}
          </div>
        ) : (
          <div className="grid">
            {posts.map((post) => {
              const img = postImage(post);
              const cat = postCategories(post)[0];
              return (
                <article className="cut" key={post.id}>
                  <div className="in">
                    <Link to={`/blog/${post.slug}`} aria-label={htmlToText(post.title.rendered)}>
                      <div className="thumb" style={img ? { backgroundImage: `url(${img})` } : undefined} />
                    </Link>
                    <div className="body">
                      <div className="meta">
                        {cat && <span>{cat}</span>}
                        {cat && <span className="dot" />}
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      </Link>
                      <div className="exc" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                      <Link className="more" to={`/blog/${post.slug}`}>Read article →</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
