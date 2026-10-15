import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  fetchPostBySlug,
  postImage,
  postCategories,
  formatDate,
  htmlToText,
  type WPPost,
} from '../lib/wp';

/* Scoped under .gwp — article reading view matching the brand */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@500;600&family=Nunito+Sans:wght@400;500;600&display=swap');
.gwp{--bg:#fdfaf4;--navy:#0b1f4d;--gold:#b98a3e;--tx:#34425f;--mut:#5f6b85;--line:rgba(185,138,62,.5);
font-family:'Nunito Sans',system-ui,sans-serif;background:var(--bg);color:var(--tx);line-height:1.6}
.gwp *,.gwp *::before,.gwp *::after{box-sizing:border-box;margin:0;padding:0}
.gwp a{color:var(--gold);text-decoration:none}
.gwp .wrap{max-width:760px;margin:0 auto;padding:110px 6% 90px}
.gwp .back{display:inline-flex;gap:8px;align-items:center;font:600 .7rem 'Montserrat',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);margin-bottom:26px}
.gwp .back:hover{color:var(--gold)}
.gwp .meta{display:flex;align-items:center;gap:10px;font:600 .66rem 'Montserrat',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.gwp .meta .dot{width:4px;height:4px;border-radius:50%;background:var(--line)}
.gwp .meta time{color:var(--mut)}
.gwp h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:clamp(2rem,4.6vw,3.1rem);line-height:1.12;color:var(--navy);margin-bottom:24px}
.gwp .hero{width:100%;aspect-ratio:16/9;border-radius:14px;background:linear-gradient(135deg,#0b1f4d,#1c3a6e);background-size:cover;background-position:center;margin-bottom:36px;border:1px solid var(--line)}
.gwp .prose{font-size:1.06rem;color:#2c3a58}
.gwp .prose p{margin:0 0 20px}
.gwp .prose h2,.gwp .prose h3{font-family:'Cormorant Garamond',Georgia,serif;color:var(--navy);margin:32px 0 14px;line-height:1.2}
.gwp .prose h2{font-size:1.9rem}.gwp .prose h3{font-size:1.5rem}
.gwp .prose a{border-bottom:1px solid var(--line)}
.gwp .prose img{max-width:100%;height:auto;border-radius:12px;margin:8px 0 22px}
.gwp .prose ul,.gwp .prose ol{margin:0 0 20px;padding-left:22px}
.gwp .prose li{margin:0 0 8px}
.gwp .prose blockquote{border-left:3px solid var(--gold);padding:4px 0 4px 18px;margin:0 0 22px;font-style:italic;color:var(--mut)}
.gwp .sk{background:#efe7d8;border-radius:2px;animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
.gwp .note{padding:26px;border:1px dashed var(--line);border-radius:12px;background:#fffaf0;color:var(--mut)}
.gwp .note b{color:var(--navy)}
`;

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WPPost | null | undefined>(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let alive = true;
    setPost(undefined);
    if (!slug) { setPost(null); return; }
    fetchPostBySlug(slug).then((p) => { if (alive) setPost(p); });
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${htmlToText(post.title.rendered)} · Guided Wealthy`;
    return () => { document.title = 'Guided Wealthy'; };
  }, [post]);

  let inner: React.ReactNode;
  if (post === undefined) {
    inner = (
      <div aria-busy="true">
        <div className="sk" style={{ height: 14, width: '30%', marginBottom: 18 }} />
        <div className="sk" style={{ height: 40, width: '85%', marginBottom: 26 }} />
        <div className="sk" style={{ aspectRatio: '16/9', borderRadius: 14, marginBottom: 30 }} />
        <div className="sk" style={{ height: 14, width: '100%', marginBottom: 12 }} />
        <div className="sk" style={{ height: 14, width: '95%', marginBottom: 12 }} />
        <div className="sk" style={{ height: 14, width: '90%' }} />
      </div>
    );
  } else if (post === null) {
    inner = (
      <div className="note">
        <b>Article not found.</b> It may have been unpublished or the link is incorrect.
        <div style={{ marginTop: 14 }}><Link to="/blog">← Back to all articles</Link></div>
      </div>
    );
  } else {
    const img = postImage(post);
    const cats = postCategories(post);
    inner = (
      <>
        <div className="meta">
          {cats.map((c, i) => (
            <React.Fragment key={c}>{i > 0 && <span className="dot" />}<span>{c}</span></React.Fragment>
          ))}
          {cats.length > 0 && <span className="dot" />}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        {img && <div className="hero" style={{ backgroundImage: `url(${img})` }} />}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? post.excerpt.rendered }} />
        <div style={{ marginTop: 40 }}>
          <Link to="/blog" className="back">← Back to all articles</Link>
        </div>
      </>
    );
  }

  return (
    <div className="gwp">
      <style>{css}</style>
      <div className="wrap">
        <Link to="/blog" className="back">← Blog</Link>
        {inner}
      </div>
    </div>
  );
}
