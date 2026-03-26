import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const LOGO_URL = "/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "capsule-nav backdrop-blur-2xl",
      scrolled && "scrolled"
    )} style={{ backgroundColor: '#e6e6e64a' }}>
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={LOGO_URL} alt="Guided Wealthy" className="h-12 md:h-14 w-auto" referrerPolicy="no-referrer" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
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
          <Link to="/booking" className="bg-primary text-cream px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
            Book Appointment
          </Link>
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
        <div className="absolute top-full left-0 right-0 mt-4 bg-cream rounded-3xl p-6 md:hidden flex flex-col space-y-6 shadow-2xl border border-primary/10">
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
          <Link 
            to="/booking" 
            onClick={() => setIsOpen(false)}
            className="bg-primary text-cream px-6 py-3 rounded-full text-center text-sm font-bold uppercase tracking-widest"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </nav>
  );
}
