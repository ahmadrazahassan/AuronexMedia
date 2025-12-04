import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const AdvertisePage: React.FC = () => {
  const packages = [
    {
      name: 'Starter',
      price: '$500',
      period: 'per month',
      features: [
        'Banner Ad Placement',
        '50,000 Impressions',
        'Homepage Sidebar',
        'Basic Analytics',
        'Mobile Responsive',
      ],
    },
    {
      name: 'Professional',
      price: '$1,500',
      period: 'per month',
      featured: true,
      features: [
        'Premium Ad Placement',
        '200,000 Impressions',
        'Homepage + Category Pages',
        'Advanced Analytics',
        'Mobile Responsive',
        'Newsletter Inclusion',
        'Social Media Mention',
      ],
    },
    {
      name: 'Enterprise',
      price: '$3,500',
      period: 'per month',
      features: [
        'Full Site Coverage',
        'Unlimited Impressions',
        'All Premium Positions',
        'Real-time Analytics',
        'Mobile Responsive',
        'Newsletter Feature',
        'Social Media Campaign',
        'Sponsored Content',
        'Dedicated Account Manager',
      ],
    },
  ];

  const stats = [
    { number: '10M+', label: 'Monthly Pageviews' },
    { number: '500K+', label: 'Monthly Unique Visitors' },
    { number: '5 min', label: 'Average Session Duration' },
    { number: '65%', label: 'Returning Visitors' },
  ];

  const audience = [
    { percentage: '45%', label: 'Developers & Engineers' },
    { percentage: '25%', label: 'Designers & Creators' },
    { percentage: '20%', label: 'Product Managers' },
    { percentage: '10%', label: 'Entrepreneurs & Founders' },
  ];

  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Advertise With Us | Signal Pulse"
        description="Reach a highly engaged audience of developers, designers, and tech professionals. Explore our advertising options and grow your brand with Signal Pulse."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-white border-b-4 border-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Advertising
              </span>
              <div className="w-2 h-2 bg-primary"></div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Reach Our
              <span className="block text-primary mt-2">Audience</span>
            </h1>

            <div className="w-24 h-1 bg-primary mb-8"></div>

            <p className="text-2xl text-gray-700 font-sf-pro leading-relaxed max-w-3xl mb-12">
              Connect with 500K+ monthly readers who are developers, designers, and tech professionals actively seeking the latest insights and tools.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-noise-dark text-white font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-noise-dark text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold font-montserrat mb-4">Our Reach</h2>
            <p className="text-lg font-sf-pro text-gray-300">Real numbers from real people</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 border-2 border-white hover:bg-primary hover:text-dark transition-all">
                <div className="text-5xl font-bold font-montserrat mb-2">{stat.number}</div>
                <div className="text-sm font-sf-pro uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-1 bg-noise-dark"></div>
                <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                  Our Audience
                </span>
                <div className="w-12 h-1 bg-noise-dark"></div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat mb-6">
                Who You'll Reach
              </h2>
              <p className="text-xl text-gray-700 font-sf-pro max-w-2xl mx-auto">
                A highly engaged community of tech professionals and decision-makers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audience.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white border-4 border-dark hover:border-primary transition-all p-10"
                >
                  <div className="text-6xl font-bold font-montserrat text-primary mb-4">
                    {item.percentage}
                  </div>
                  <div className="text-2xl font-bold font-montserrat text-dark">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Pricing
              </span>
              <div className="w-12 h-1 bg-noise-dark"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat mb-6">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-700 font-sf-pro max-w-2xl mx-auto">
              Flexible advertising solutions for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`bg-white border-4 ${pkg.featured ? 'border-primary' : 'border-dark'} hover:border-primary transition-all p-8 relative ${pkg.featured ? 'transform md:-translate-y-4' : ''}`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-6 py-2 bg-primary text-dark font-sf-pro font-bold text-xs tracking-wider uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold font-montserrat text-dark mb-4">
                    {pkg.name}
                  </h3>
                  <div className="text-5xl font-bold font-montserrat text-primary mb-2">
                    {pkg.price}
                  </div>
                  <div className="text-sm font-sf-pro text-gray-600 uppercase tracking-wider">
                    {pkg.period}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-sf-pro text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block w-full py-4 text-center font-sf-pro font-bold text-sm tracking-wider uppercase transition-all ${
                    pkg.featured 
                      ? 'bg-primary hover:bg-noise-dark text-dark hover:text-white' 
                      : 'border-2 border-dark hover:bg-noise-dark text-dark hover:text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions CTA */}
      <section className="py-32 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold font-montserrat text-dark mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-2xl font-sf-pro text-dark mb-12 leading-relaxed">
              We offer tailored advertising packages for larger campaigns and long-term partnerships. Let's discuss your specific needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-6 bg-noise-dark text-white font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-dark transition-all"
            >
              Contact Sales
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
