import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found - AuronexMedia" description="The page you're looking for doesn't exist." />
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <span className="text-[180px] font-black text-gray-900 leading-none font-montserrat block">
              404
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-sf-pro max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-4 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
            >
              Go Home
            </Link>
            <Link
              to="/blog"
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors"
            >
              Browse Articles
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/categories" className="text-gray-700 hover:text-gray-900 font-medium">
                Categories
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/tags" className="text-gray-700 hover:text-gray-900 font-medium">
                Tags
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
