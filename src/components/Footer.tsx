import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const LOGO_URL = "https://i.postimg.cc/G9zfgxzC/logo.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-cream pt-20 pb-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="space-y-6">
          <img src={LOGO_URL} alt="Guided Wealthy" className="h-16 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
          <p className="text-cream/70 leading-relaxed">
            Empowering individuals and families to take control of their financial future with clarity, confidence, and discipline.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Instagram size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Quick Links</h4>
          <ul className="space-y-4 text-cream/70">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Our Expertise</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/booking" className="hover:text-accent transition-colors">Book a Session</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Contact Us</h4>
          <ul className="space-y-4 text-cream/70">
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-accent" />
              <span>contact@guidedwealthy.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-accent" />
              <span>+91 79951 65300</span>
            </li>
            <li className="flex items-center space-x-3">
              <MapPin size={18} className="text-accent" />
              <span>India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 text-center text-cream/50 text-sm space-y-4">
        <p>© {new Date().getFullYear()} Guided Wealthy. All rights reserved.</p>
        <p className="max-w-3xl mx-auto italic">
          “Investments in financial markets are subject to risks. Please evaluate all related documents carefully before making any investment decisions. Registration, certifications, or past experience do not guarantee future performance or returns.”
        </p>
      </div>
    </footer>
  );
}
