import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About - AuronexMedia"
        description="Learn more about AuronexMedia and our mission to create meaningful content."
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#000000] opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-primary text-white text-sm font-medium font-sf-pro tracking-wide">
                ABOUT US
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-montserrat text-primary leading-tight">
              Crafting Stories<br/>That Matter
            </h1>
            <p className="text-xl md:text-2xl text-secondary font-sf-pro max-w-2xl mx-auto leading-relaxed">
              We're on a mission to deliver thoughtful, impactful content on technology, design, and the future we're building together.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-medium text-secondary font-sf-pro tracking-wide uppercase mb-4 block">
                  Our Mission
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 font-montserrat leading-tight">
                  Ideas That Drive Progress
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-secondary font-sf-pro leading-relaxed">
                  At AuronexMedia, we believe in the transformative power of words. Our mission is to create a platform where ideas flourish, knowledge is shared freely, and meaningful conversations begin.
                </p>
                <p className="text-lg text-secondary font-sf-pro leading-relaxed">
                  We're committed to delivering high-quality, well-researched content that keeps you at the forefront of technology, design, and digital innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-sm font-medium text-secondary font-sf-pro tracking-wide uppercase mb-4 block">
                Our Approach
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary font-montserrat">
                What We Offer
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-10 hover:border-primary transition-colors duration-300 group">
                <div className="w-14 h-14 bg-primary mb-8 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat group-hover:underline">
                  Deep Insights
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  In-depth analysis and thoughtful commentary on the latest trends, technologies, and developments shaping our digital future.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-10 hover:border-primary transition-colors duration-300 group">
                <div className="w-14 h-14 bg-primary mb-8 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat group-hover:underline">
                  Practical Guides
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  Step-by-step tutorials, actionable how-to guides, and real-world examples for developers, designers, and creators.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-10 hover:border-primary transition-colors duration-300 group">
                <div className="w-14 h-14 bg-primary mb-8 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat group-hover:underline">
                  Community Focus
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  A welcoming space for thoughtful discussion, knowledge sharing, and building meaningful connections within our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-secondary font-sf-pro tracking-wide uppercase mb-4 block">
                Our Values
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary font-montserrat mb-6">
                What Drives Us
              </h2>
              <p className="text-lg text-secondary font-sf-pro max-w-2xl mx-auto">
                These core principles guide everything we do, from content creation to community engagement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl font-montserrat">01</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 font-montserrat">
                  Quality First
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  We prioritize depth and accuracy over speed, ensuring every piece meets our rigorous standards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl font-montserrat">02</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 font-montserrat">
                  Accessibility
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  Complex topics made clear and accessible to readers of all backgrounds and experience levels.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl font-montserrat">03</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 font-montserrat">
                  Continuous Learning
                </h3>
                <p className="text-secondary font-sf-pro leading-relaxed">
                  We're always learning and evolving with the rapidly changing landscape of technology and design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
