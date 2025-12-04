import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const CareersPage: React.FC = () => {
  const openPositions = [
    {
      title: 'Senior Content Writer',
      department: 'Editorial',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create compelling content across technology, design, and innovation topics.',
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and maintain our digital publication platform using React and modern web technologies.',
    },
    {
      title: 'Social Media Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Grow our social media presence and engage with our community across platforms.',
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design beautiful and functional user experiences for our digital products.',
    },
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Industry-leading compensation packages with performance bonuses.',
    },
    {
      icon: '🏠',
      title: 'Remote Work',
      description: 'Work from anywhere in the world. True flexibility.',
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: '$2,000 annual budget for courses, books, and conferences.',
    },
    {
      icon: '🏥',
      title: 'Health Insurance',
      description: 'Comprehensive health, dental, and vision coverage.',
    },
    {
      icon: '🌴',
      title: 'Unlimited PTO',
      description: 'Take time off when you need it. No questions asked.',
    },
    {
      icon: '🚀',
      title: 'Growth Opportunities',
      description: 'Clear career progression paths and mentorship programs.',
    },
  ];

  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Careers - Join Our Team | Signal Pulse"
        description="Join Signal Pulse and help shape the future of digital publishing. Explore open positions and become part of our innovative team."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-white border-b-4 border-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-noise-dark opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Careers
              </span>
              <div className="w-2 h-2 bg-primary"></div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Join Our
              <span className="block text-primary mt-2">Mission</span>
            </h1>

            <div className="w-24 h-1 bg-primary mb-8"></div>

            <p className="text-2xl text-gray-700 font-sf-pro leading-relaxed max-w-3xl">
              We're building the future of digital publishing. Join our passionate team of creators, designers, and innovators who are shaping how people consume content.
            </p>

            <div className="flex flex-wrap gap-4 mt-12">
              <a 
                href="#positions"
                className="px-10 py-5 bg-noise-dark text-white font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300"
              >
                View Open Positions
              </a>
              <a 
                href="#culture"
                className="px-10 py-5 border-2 border-dark text-dark font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-noise-dark hover:text-white transition-all duration-300"
              >
                Our Culture
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-noise-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Team Members' },
              { number: '15', label: 'Countries' },
              { number: '10M+', label: 'Monthly Readers' },
              { number: '4.8★', label: 'Glassdoor Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold font-montserrat mb-2">{stat.number}</div>
                <div className="text-sm font-sf-pro uppercase tracking-wider text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Our Culture
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat">
              Why Work With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-dark hover:border-primary transition-all p-8"
              >
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-dark font-montserrat mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 font-sf-pro leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Open Positions
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat mb-6">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-700 font-sf-pro max-w-2xl">
              We're always looking for talented individuals to join our mission. Explore our current openings below.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {openPositions.map((position, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-dark hover:border-primary transition-all p-8 group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-2 bg-noise-dark text-white font-sf-pro font-bold text-xs tracking-wider uppercase">
                        {position.department}
                      </span>
                      <span className="px-3 py-2 border-2 border-dark text-dark font-sf-pro font-bold text-xs tracking-wider uppercase">
                        {position.type}
                      </span>
                      <span className="px-3 py-2 border-2 border-dark text-dark font-sf-pro font-bold text-xs tracking-wider uppercase">
                        📍 {position.location}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold text-dark font-montserrat mb-4">
                      {position.title}
                    </h3>

                    <p className="text-gray-600 font-sf-pro leading-relaxed">
                      {position.description}
                    </p>
                  </div>

                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-noise-dark text-dark hover:text-white font-sf-pro font-bold text-sm tracking-wider uppercase transition-all whitespace-nowrap group-hover:translate-x-2 duration-300"
                  >
                    Apply Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 p-12 bg-gray-50 border-4 border-dark text-center">
            <h3 className="text-3xl font-bold text-dark font-montserrat mb-4">
              Don't See a Perfect Fit?
            </h3>
            <p className="text-xl text-gray-700 font-sf-pro mb-8 max-w-2xl mx-auto">
              We're always open to connecting with talented people. Send us your resume and let's talk.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 border-4 border-dark text-dark hover:bg-noise-dark hover:text-white transition-all font-sf-pro font-bold text-sm tracking-wider uppercase"
            >
              Get In Touch
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
