import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories/business', label: 'Business' },
    { to: '/categories/finance', label: 'Finance' },
    { to: '/categories/saas', label: 'SaaS' },
    { to: '/categories/startups', label: 'Startups' },
    { to: '/categories/ai', label: 'AI' },
    { to: '/categories/reviews', label: 'Reviews' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Ultra-Modern Unique Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between px-8 lg:px-16 h-[72px] border-b border-black/[0.06]">
            {/* Logo - Montserrat Typography */}
            <Link 
              to="/" 
              className="group relative"
            >
              <div className="flex items-baseline">
                <span className="font-montserrat text-[26px] font-black text-gray-900 tracking-[-0.03em] uppercase">
                  Auronex
                </span>
                <span className="font-montserrat text-[26px] font-medium text-primary tracking-[-0.03em] uppercase">
                  Media
                </span>
              </div>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>

            {/* Desktop Navigation - Asymmetric Layout */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative px-5 py-2"
                >
                  <span className={`font-montserrat text-[14px] font-semibold uppercase tracking-[0.02em] transition-all ${
                    location.pathname === link.to 
                      ? 'text-primary' 
                      : 'text-gray-500 group-hover:text-dark'
                  }`}>
                    {link.label}
                  </span>
                  {/* Active Indicator - Perfect Position */}
                  {location.pathname === link.to && (
                    <div className="absolute bottom-0 left-5 w-6 h-[2px] bg-primary"></div>
                  )}
                  {/* Hover State - Subtle Background */}
                  <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
            </div>

            {/* Right Actions - Refined */}
            <div className="flex items-center gap-3">
              {/* Search - Text Only */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex items-center gap-2 px-4 py-2 group"
                aria-label="Search"
              >
                <span className="w-[3px] h-[3px] bg-gray-400 group-hover:bg-primary transition-colors"></span>
                <span className="font-montserrat text-[14px] font-semibold uppercase tracking-[0.02em] text-gray-500 group-hover:text-primary transition-colors">
                  Search
                </span>
              </button>

              {/* Mobile Menu - Minimal Lines */}
              <button
                className="lg:hidden w-8 h-8 flex flex-col justify-center items-end gap-[6px]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-full h-[2px] bg-dark transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block w-5 h-[2px] bg-dark transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-full h-[2px] bg-dark transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Sophisticated */}
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu - Modern Slide */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-40 lg:hidden transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-8 h-[72px] border-b border-black/[0.06]">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <div className="flex items-baseline">
                <span className="font-montserrat text-xl font-black text-gray-900 tracking-[-0.03em] uppercase">Auronex</span>
                <span className="font-montserrat text-xl font-medium text-primary tracking-[-0.03em] uppercase">Media</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-dark hover:bg-primary/[0.05] transition-colors"
            >
              <span className="text-2xl font-light">×</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto px-8 py-8">
            <div className="space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="group block"
                >
                  <div className={`flex items-center justify-between px-5 py-4 transition-all ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/[0.05]'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/[0.03]'
                  }`}>
                    <span className="font-montserrat text-base font-semibold uppercase tracking-[0.02em]">
                      {link.label}
                    </span>
                    <span className="font-montserrat text-xs text-gray-400 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Link>
              ))}
              
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full group block"
              >
                <div className="flex items-center justify-between px-5 py-4 text-gray-600 hover:text-primary hover:bg-primary/[0.03] transition-all">
                  <span className="font-montserrat text-base font-semibold uppercase tracking-[0.02em]">
                    Search
                  </span>
                  <span className="w-[3px] h-[3px] bg-gray-400 group-hover:bg-primary transition-colors"></span>
                </div>
              </button>
            </div>
          </nav>

          {/* Mobile Footer */}
          <div className="px-8 py-6 border-t border-black/[0.06]">
            <p className="font-montserrat text-xs text-gray-400 text-center">
              © 2024 AuronexMedia
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
