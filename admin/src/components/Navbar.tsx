import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-end gap-4 sticky top-0 z-40">
      {/* 1. Notification Icon Button */}
   

      {/* 2. Profile Avatar Section with Email, Role, & Arrow Down Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 pl-3 border-l border-slate-200 hover:opacity-90 transition-all focus:outline-none select-none cursor-pointer"
        >
          {/* Avatar */}
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt="Admin Profile"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
          />

          {/* Email & Role Info */}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              {user?.email || 'admin@digisol.com'}
              <Shield className="w-3 h-3 text-blue-600" />
            </p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              {user?.role || 'Super Admin'}
            </p>
          </div>

          {/* Arrow Down Button */}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </button>

        {/* 3. Dropdown Menu containing Notification & Logout */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
            {/* Notification item */}
            {/* <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Notifications</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            </button> */}

            {/* Divider */}
            <div className="my-1 border-t border-slate-100" />

            {/* Logout button */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
