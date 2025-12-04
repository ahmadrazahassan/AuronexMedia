import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-dark relative">
      {/* Vertical Accent Bars - Multiple */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
      <div className="absolute right-0 top-0 h-32 w-2 bg-dark"></div>
      
      {/* Main Footer Content */}
      <div className="border-b-2 border-dark relative">
        {/* Diagonal Stripe Accent */}
        <div className="absolute top-0 right-0 w-64 h-2 bg-primary transform -skew-x-12"></div>
        
        <div className="max-w-7xl mx-auto pl-8 pr-4 sm:px-10 lg:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Brand Section - Editorial Style */}
            <div className="lg:col-span-6 space-y-10">
              {/* Logo - Montserrat Typography */}
              <Link to="/" className="inline-flex items-center gap-5 group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 group-hover:bg-primary transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-black font-montserrat text-2xl">AM</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-black font-montserrat text-gray-900 tracking-[-0.03em] uppercase">
                      Auronex
                    </span>
                    <span className="text-3xl font-medium font-montserrat text-primary tracking-[-0.03em] uppercase">
                      Media
                    </span>
                  </div>
                  <span className="text-xs font-montserrat text-gray-500 tracking-[0.15em] uppercase mt-1">
                    Digital Publication
                  </span>
                </div>
              </Link>

              <p className="text-gray-700 font-sf-pro text-xl leading-relaxed max-w-lg border-l-4 border-primary pl-6">
                A modern digital publication exploring technology, design, and innovation through in-depth articles and expert perspectives.
              </p>

              {/* Newsletter - Unique Layout */}
              <div className="space-y-5 pt-6 relative">
                {/* Number Badge */}
                <div className="absolute -left-6 top-0 w-10 h-10 bg-noise-dark flex items-center justify-center">
                  <span className="text-white font-black text-sm">01</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-dark"></div>
                  <span className="text-[11px] font-black font-sf-pro text-dark tracking-[0.2em] uppercase">
                    Join Newsletter
                  </span>
                  <div className="h-px w-12 bg-primary"></div>
                </div>
                
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full px-0 py-4 border-b-4 border-dark focus:border-primary focus:outline-none font-sf-pro text-lg bg-transparent"
                  />
                  <button className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary hover:bg-noise-dark text-dark hover:text-white transition-all flex items-center justify-center group relative overflow-hidden">
                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-sf-pro">
                  Weekly insights on design, tech & innovation. No spam.
                </p>
              </div>
            </div>

            {/* Navigation Grid - Numbered Sections */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
              {/* Section 02 - Navigate */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="text-white font-black text-xs">02</span>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px w-6 bg-dark"></div>
                  <h4 className="font-black font-sf-pro text-dark text-[11px] tracking-[0.2em] uppercase">
                    Navigate
                  </h4>
                </div>
                
                <ul className="space-y-3 font-sf-pro text-sm border-l-2 border-dark pl-4">
                  {[
                    { to: '/categories/business', label: 'Business' },
                    { to: '/categories/finance', label: 'Finance' },
                    { to: '/categories/saas', label: 'SaaS' },
                    { to: '/categories/ai', label: 'AI' }
                  ].map((link, i) => (
                    <li key={link.to}>
                      <Link 
                        to={link.to} 
                        className="group relative text-gray-700 hover:text-dark font-medium transition-colors flex items-center gap-3"
                      >
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary w-4">
                          0{i + 1}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 03 - Company */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-noise-dark flex items-center justify-center">
                  <span className="text-white font-black text-xs">03</span>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px w-6 bg-dark"></div>
                  <h4 className="font-black font-sf-pro text-dark text-[11px] tracking-[0.2em] uppercase">
                    Company
                  </h4>
                </div>
                
                <ul className="space-y-3 font-sf-pro text-sm border-l-2 border-dark pl-4">
                  {[
                    { to: '/about', label: 'About Us' },
                    { to: '/contact', label: 'Contact' },
                    { to: '/careers', label: 'Careers' },
                    { to: '/advertise', label: 'Advertise' }
                  ].map((link, i) => (
                    <li key={link.to}>
                      <Link 
                        to={link.to} 
                        className="group relative text-gray-700 hover:text-dark font-medium transition-colors flex items-center gap-3"
                      >
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary w-4">
                          0{i + 1}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 04 - Legal */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="text-white font-black text-xs">04</span>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px w-6 bg-dark"></div>
                  <h4 className="font-black font-sf-pro text-dark text-[11px] tracking-[0.2em] uppercase">
                    Legal
                  </h4>
                </div>
                
                <ul className="space-y-3 font-sf-pro text-sm border-l-2 border-dark pl-4">
                  {[
                    { to: '/privacy', label: 'Privacy' },
                    { to: '/terms', label: 'Terms' },
                    { to: '/cookies', label: 'Cookies' },
                    { to: '/licenses', label: 'Licenses' }
                  ].map((link, i) => (
                    <li key={link.to}>
                      <Link 
                        to={link.to} 
                        className="group relative text-gray-700 hover:text-dark font-medium transition-colors flex items-center gap-3"
                      >
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary w-4">
                          0{i + 1}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Diagonal Accent Bottom */}
        <div className="absolute -bottom-px left-0 w-48 h-1 bg-primary transform -skew-x-12"></div>
      </div>

      {/* Bottom Bar - Editorial Asymmetric */}
      <div className="bg-noise-dark text-white relative overflow-hidden">
        {/* Diagonal Stripes Background */}
        <div className="absolute top-0 left-0 w-32 h-full bg-primary opacity-20 transform -skew-x-12"></div>
        <div className="absolute bottom-0 right-0 w-24 h-full bg-white opacity-5 transform skew-x-12"></div>
        
        <div className="max-w-7xl mx-auto pl-8 pr-4 sm:px-10 lg:px-12 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left - Copyright */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary flex items-center justify-center">
                  <span className="text-white font-black text-xs">05</span>
                </div>
                <div className="h-px flex-1 bg-white opacity-20"></div>
              </div>
              <div className="font-montserrat">
                <div className="text-xl font-black tracking-tight uppercase">
                  © {currentYear} AuronexMedia
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  All rights reserved. Made with precision.
                </div>
              </div>
            </div>

            {/* Center - Quick Links */}
            <div className="md:col-span-4 flex flex-wrap gap-4 justify-center">
              {['Privacy', 'Terms', 'Cookies'].map((item, i) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="group relative px-4 py-2 border-2 border-white hover:bg-white hover:text-dark transition-all font-sf-pro font-bold text-[10px] tracking-wider uppercase"
                >
                  <span className="absolute -top-2 -left-2 w-5 h-5 bg-primary flex items-center justify-center text-dark text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {i + 1}
                  </span>
                  {item}
                </Link>
              ))}
            </div>

            {/* Right - Social Icons */}
            <div className="md:col-span-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-end">
                  <div className="h-px w-12 bg-primary"></div>
                  <span className="text-[10px] font-black font-sf-pro text-gray-400 tracking-[0.2em] uppercase">
                    Connect
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  {[
                    { 
                      name: 'Twitter',
                      href: 'https://twitter.com',
                      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    },
                    {
                      name: 'LinkedIn',
                      href: 'https://linkedin.com',
                      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"
                    },
                    {
                      name: 'GitHub',
                      href: 'https://github.com',
                      icon: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                    },
                    {
                      name: 'Instagram',
                      href: 'https://instagram.com',
                      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"
                    }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-12 h-12 bg-white hover:bg-primary text-dark hover:text-dark transition-all flex items-center justify-center group overflow-hidden"
                      aria-label={social.name}
                    >
                      <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                      {/* Corner Triangle */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-t-dark group-hover:border-t-dark border-l-[8px] border-l-transparent transition-all"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute -bottom-px left-0 w-64 h-1 bg-primary transform -skew-x-12"></div>
      </div>
    </footer>
  );
};
