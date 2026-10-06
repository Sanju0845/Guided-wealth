import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = '/assets/logo.png';

/* Same nav CSS as clguid.html. Plain CSS (not Tailwind) so nothing in the
   project can override the fonts, and every rule is scoped under .gwn */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');

.gwn{--gold:#e0b15f;--line:rgba(224,177,95,.42);position:fixed;top:16px;left:50%;transform:translateX(-50%);width:min(1240px,94%);z-index:50;display:flex;align-items:center;justify-content:space-between;padding:6px 14px 6px 26px;border-radius:999px;border:1px solid rgba(224,177,95,.28);background:rgba(12,28,64,.25);-webkit-backdrop-filter:blur(18px) saturate(150%);backdrop-filter:blur(18px) saturate(150%);box-shadow:0 10px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.06);font-family:'Montserrat',sans-serif;color:#e9eef8;transition:background .3s}
.gwn.scrolled{background:rgba(12,28,64,.45)}
.gwn *,.gwn *::before,.gwn *::after{box-sizing:border-box;font-family:'Montserrat',sans-serif}
.gwn a{color:inherit;text-decoration:none}
.gwn .logo img{height:38px;display:block;width:auto}
.gwn .links{display:flex;gap:44px;font-weight:500;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase}
.gwn .links a{position:relative;padding:13px 0;transition:color .25s,text-shadow .25s}
.gwn .links a:after{content:"";position:absolute;left:0;right:0;bottom:7px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,#f2d493 25%,#f2d493 75%,transparent);transform:scaleX(0);opacity:0;transition:transform .3s,opacity .3s}
.gwn .links a:hover{color:#f2d493}
.gwn .links a:hover:after{transform:scaleX(.6);opacity:.5}
.gwn .links a.on{color:#f8e2ad;text-shadow:0 0 12px rgba(246,220,160,.85),0 0 24px rgba(224,177,95,.45)}
.gwn .links a.on:after{transform:scaleX(1);opacity:1}
.gwn .act{display:flex;gap:12px;align-items:center}
.gwn .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:.66rem;line-height:1.6;letter-spacing:.12em;text-transform:uppercase;padding:11px 20px;border-radius:999px;border:1px solid var(--line);background:rgba(5,13,31,.5);color:#e9eef8;cursor:pointer;transition:.25s}
.gwn .btn:hover{border-color:var(--gold);transform:translateY(-2px)}
.gwn .btn.g{background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;border-color:transparent}
.gwn .btn.g:hover{box-shadow:0 8px 26px rgba(224,177,95,.35)}
.gwn .burger{display:none;background:none;border:1px solid var(--line);color:var(--gold);border-radius:50%;width:40px;height:40px;font-size:1.1rem;cursor:pointer}

/* logged-in menu */
.gwn .user{position:relative}
.gwn .user .btn{text-transform:none;letter-spacing:.02em;font-size:.72rem}
.gwn .av{width:24px;height:24px;border-radius:50%;background:var(--gold);color:#1a1307;display:grid;place-items:center}
.gwn .dd{position:absolute;right:0;top:calc(100% + 14px);width:230px;border-radius:18px;border:1px solid var(--line);background:rgba(8,20,48,.92);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);padding:8px 0;box-shadow:0 16px 40px rgba(0,0,0,.4);overflow:hidden}
.gwn .dd .who{padding:10px 16px 12px;border-bottom:1px solid rgba(224,177,95,.2)}
.gwn .dd .who small{display:block;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(222,232,248,.55)}
.gwn .dd .who b{display:block;font-size:.78rem;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gwn .dd .who span{display:flex;align-items:center;gap:4px;margin-top:4px;font-size:.62rem;font-weight:600;color:#4ade80}
.gwn .dd a,.gwn .dd button{display:flex;align-items:center;gap:8px;width:100%;padding:9px 16px;font-size:.72rem;font-weight:500;background:none;border:0;color:rgba(233,238,248,.85);text-align:left;cursor:pointer;transition:.2s}
.gwn .dd a:hover,.gwn .dd button:hover{background:rgba(255,255,255,.05);color:#f2d493}
.gwn .dd .out{color:#f87171;border-top:1px solid rgba(224,177,95,.2);margin-top:4px}
.gwn .dd .out:hover{color:#fca5a5;background:rgba(248,113,113,.08)}

/* mobile panel */
.gwn .m{position:absolute;top:calc(100% + 10px);left:0;right:0;display:flex;flex-direction:column;gap:0;padding:14px 26px 20px;border-radius:26px;border:1px solid var(--line);background:rgba(8,20,48,.9);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px)}
.gwn .m>a:not(.btn){padding:12px 0;font-weight:500;font-size:.75rem;letter-spacing:.16em;text-transform:uppercase}
.gwn .m>a.on{color:#f8e2ad;text-shadow:0 0 12px rgba(246,220,160,.85)}
.gwn .m .btn{margin-top:10px;width:100%}

@media(max-width:1000px){
 .gwn .links,.gwn .act .login,.gwn .act .user{display:none}
 .gwn .burger{display:block}
}
@media(max-width:640px){.gwn .act .btn.g{display:none}}
`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { user, isLoggedIn, openLoginModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // close menus when the page changes
  useEffect(() => {
    setIsOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Resources', path: '/resources' },
    // { name: 'Research', path: '/research' },
    { name: 'About', path: '/about' },
  ];

  const displayName = user ? (user.name && user.name !== 'User' ? user.name : user.phone) : '';

  return (
    <nav className={`gwn${scrolled ? ' scrolled' : ''}`}>
      <style>{css}</style>

      <Link to="/" className="logo" aria-label="Guided Wealthy">
        <img src={LOGO_URL} alt="Guided Wealthy" referrerPolicy="no-referrer" />
      </Link>

      <div className="links">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.path} className={location.pathname === link.path ? 'on' : ''}>
            {link.name}
          </Link>
        ))}
      </div>

      <div className="act">
        <Link to="/booking" className="btn g">
          Book appointment →
        </Link>

        {isLoggedIn && user ? (
          <div className="user" ref={dropdownRef}>
            <button className="btn" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <span className="av"><User size={13} /></span>
              <span style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <ChevronDown size={14} />
            </button>

            {userDropdownOpen && (
              <div className="dd">
                <div className="who">
                  <small>Signed in as</small>
                  <b>{displayName}</b>
                  <span><ShieldCheck size={12} /> Verified Mobile Account</span>
                </div>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">My Profile</Link>
                <Link to="/calculators">Wealth Calculators</Link>
                <Link to="/booking">My Appointments</Link>
                <button
                  className="out"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn login" onClick={openLoginModal}>
            ⇥ Login
          </button>
        )}

        <button className="burger" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div className="m">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className={location.pathname === link.path ? 'on' : ''}>
              {link.name}
            </Link>
          ))}
          <Link to="/booking" className="btn g">Book appointment →</Link>
          {isLoggedIn && user ? (
            <button
              className="btn"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
            >
              Sign Out ({displayName})
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setIsOpen(false);
                openLoginModal();
              }}
            >
              ⇥ Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}