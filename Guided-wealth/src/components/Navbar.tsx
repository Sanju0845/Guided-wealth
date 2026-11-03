import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const LOGO_URL = "/assets/logo.png";

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Resources', path: '/resources' },
    // { name: 'Research', path: '/research' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "capsule-nav backdrop-blur-2xl",
      scrolled && "scrolled"
    )} style={{ backgroundColor: '#e6e6e64a' }}>
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={LOGO_URL} alt="Guided Wealthy" className="h-10 md:h-12 w-auto" referrerPolicy="no-referrer" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xs font-bold uppercase tracking-widest transition-colors hover:text-accent",
                location.pathname === link.path ? "text-accent" : "text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/booking" className="bg-primary text-cream px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-sm">
            Book Appointment
          </Link>

          {/* Login Button / User Menu */}
          {isLoggedIn && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 hover:border-accent text-primary px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-[10px]">
                  <User size={13} />
                </div>
                <span className="max-w-[110px] truncate">{user.name && user.name !== 'User' ? user.name : user.phone}</span>
                <ChevronDown size={14} className="text-primary/60" />
              </button>

              {/* Profile Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-primary/10 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-primary/10 bg-cream/50 rounded-t-2xl">
                    <p className="text-[11px] text-primary/60 uppercase font-semibold tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-ink truncate mt-0.5">{user.name && user.name !== 'User' ? user.name : user.phone}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-semibold">
                      <ShieldCheck size={12} />
                      <span>Verified Mobile Account</span>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-primary hover:bg-cream hover:text-accent transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-primary hover:bg-cream hover:text-accent transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/calculators"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-primary hover:bg-cream hover:text-accent transition-colors"
                    >
                      Wealth Calculators
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-primary hover:bg-cream hover:text-accent transition-colors"
                    >
                      My Appointments
                    </Link>
                  </div>

                  <div className="border-t border-primary/10 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-1.5 border border-primary/20 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all cursor-pointer"
            >
              <LogIn size={14} />
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-cream rounded-3xl p-6 md:hidden flex flex-col space-y-4 shadow-2xl border border-primary/10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-sm font-bold uppercase tracking-widest",
                location.pathname === link.path ? "text-accent" : "text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex flex-col space-y-3">
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-cream px-6 py-3 rounded-full text-center text-sm font-bold uppercase tracking-widest"
            >
              Book Appointment
            </Link>
            
            {isLoggedIn && user ? (
              <div className="bg-white rounded-2xl p-4 border border-primary/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{user.name && user.name !== 'User' ? user.name : user.phone}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openLoginModal();
                }}
                className="flex items-center justify-center gap-2 border border-primary/20 text-primary px-6 py-3 rounded-full text-center text-sm font-bold uppercase tracking-widest hover:border-accent hover:text-accent cursor-pointer"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
