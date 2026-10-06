import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = '/assets/logo.png';

/* Full-width fixed header, solid white. Plain CSS scoped under .gwn */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');

.gwn{--gold:#b98a3e;--navy:#0b1f4d;--line:rgba(185,138,62,.55);--h:52px;
position:fixed;top:0;left:0;right:0;width:100%;height:var(--h);z-index:50;
display:flex;align-items:center;justify-content:space-between;
padding:0 max(24px,calc((100% - 1240px)/2));
background:#ffffff;border-bottom:1px solid rgba(11,31,77,.08);
box-shadow:0 1px 0 rgba(185,138,62,.25),0 2px 12px rgba(11,31,77,.05);
font-family:'Montserrat',sans-serif;color:var(--navy);transition:box-shadow .3s}
.gwn:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:linear-gradient(90deg,transparent,rgba(201,153,63,.8) 20%,rgba(201,153,63,.8) 80%,transparent);opacity:.7;pointer-events:none}
.gwn.scrolled{box-shadow:0 6px 22px rgba(11,31,77,.12)}
.gwn *,.gwn *::before,.gwn *::after{box-sizing:border-box;font-family:'Montserrat',sans-serif}
.gwn a{color:inherit;text-decoration:none}
.gwn .logo img{height:36px;display:block;width:auto}
.gwn .links{display:flex;gap:44px;height:100%;font-weight:600;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase}
.gwn .links a{position:relative;display:flex;align-items:center;height:100%;color:var(--navy);transition:color .25s}
.gwn .links a:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,#c9993f,#e0b15f);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.gwn .links a:hover{color:var(--gold)}
.gwn .links a:hover:after{transform:scaleX(.5)}
.gwn .links a.on{color:var(--gold)}
.gwn .links a.on:after{transform:scaleX(1)}
.gwn .act{display:flex;gap:12px;align-items:center}
.gwn .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:.68rem;line-height:1.6;letter-spacing:.12em;text-transform:uppercase;padding:9px 20px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--navy);cursor:pointer;transition:.25s}
.gwn .btn:hover{border-color:var(--gold);background:#fffaf0;transform:translateY(-1px)}
.gwn .btn.g{background:linear-gradient(135deg,#f0cd85,#c9993f);color:#1a1307;border-color:transparent}
.gwn .btn.g:hover{box-shadow:0 8px 22px rgba(185,138,62,.35)}
.gwn .burger{display:none;background:#fff;border:1px solid var(--line);color:var(--navy);border-radius:10px;width:38px;height:38px;font-size:1.05rem;cursor:pointer}

/* logged-in menu */
.gwn .user{position:relative}
.gwn .user .btn{text-transform:none;letter-spacing:.02em;font-size:.74rem}
.gwn .av{width:24px;height:24px;border-radius:50%;background:var(--gold);color:#fff;display:grid;place-items:center}
.gwn .dd{position:absolute;right:0;top:calc(100% + 12px);width:240px;border-radius:12px;border:1px solid rgba(11,31,77,.1);background:#fff;padding:8px 0;box-shadow:0 16px 40px rgba(11,31,77,.18);overflow:hidden}
.gwn .dd .who{padding:10px 16px 12px;border-bottom:1px solid rgba(11,31,77,.08)}
.gwn .dd .who small{display:block;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#6b7691}
.gwn .dd .who b{display:block;font-size:.8rem;margin-top:2px;color:var(--navy);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gwn .dd .who span{display:flex;align-items:center;gap:4px;margin-top:4px;font-size:.62rem;font-weight:600;color:#15803d}
.gwn .dd a,.gwn .dd button{display:flex;align-items:center;gap:8px;width:100%;padding:10px 16px;font-size:.74rem;font-weight:500;background:none;border:0;color:#34425f;text-align:left;cursor:pointer;transition:.2s}
.gwn .dd a:hover,.gwn .dd button:hover{background:#fffaf0;color:var(--gold)}
.gwn .dd .out{color:#dc2626;border-top:1px solid rgba(11,31,77,.08);margin-top:4px}
.gwn .dd .out:hover{color:#b91c1c;background:#fef2f2}

/* mobile panel: full width, attached under the bar */
.gwn .m{position:absolute;top:100%;left:0;right:0;display:flex;flex-direction:column;padding:8px 24px 22px;background:#fff;border-top:1px solid rgba(11,31,77,.08);border-bottom:2px solid rgba(185,138,62,.5);box-shadow:0 18px 30px rgba(11,31,77,.15)}
.gwn .m>a:not(.btn){padding:15px 0;border-bottom:1px solid rgba(11,31,77,.07);font-weight:600;font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:var(--navy)}
.gwn .m>a.on{color:var(--gold)}
.gwn .m .btn{margin-top:12px;width:100%}

@media(max-width:1000px){
 .gwn .links,.gwn .act .login,.gwn .act .user{display:none}
 .gwn .burger{display:block}
}
@media(max-width:640px){.gwn{--h:56px}.gwn .logo img{height:32px}.gwn .act .btn.g{display:none}}
`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { user, isLoggedIn, openLoginModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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