import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Privacy Policy | Signal Pulse"
        description="Learn how Signal Pulse collects, uses, and protects your personal information."
      />

      <section className="relative pt-32 pb-16 bg-white border-b-4 border-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">Legal</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Privacy<span className="block text-primary mt-2">Policy</span>
            </h1>

            <div className="w-24 h-1 bg-primary mb-6"></div>
            <p className="text-lg text-gray-600 font-sf-pro">Last updated: November 24, 2025</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Introduction</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                At Signal Pulse, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
              </p>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">Information We Collect</h2>
              <ul className="space-y-3">
                {['Email addresses from newsletter subscriptions', 'Name and contact information', 'Usage data and analytics', 'Cookies and tracking technologies'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary flex-shrink-0 mt-1"></div>
                    <span className="text-gray-700 font-sf-pro text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">How We Use Your Information</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg mb-4">
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="space-y-2 text-gray-700 font-sf-pro text-lg">
                <li>• Sending newsletters and updates</li>
                <li>• Responding to your inquiries</li>
                <li>• Analyzing site usage and improving content</li>
                <li>• Protecting against fraudulent activity</li>
              </ul>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Data Security</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Your Rights</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-700 font-sf-pro text-lg">
                <li>• Access your personal data</li>
                <li>• Request correction of your data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Object to processing of your data</li>
              </ul>
            </div>

            <div className="p-8 border-4 border-dark bg-noise-dark text-white">
              <h2 className="text-3xl font-bold font-montserrat mb-4">Contact Us</h2>
              <p className="font-sf-pro leading-relaxed text-lg">
                If you have questions about this Privacy Policy, please contact us at <span className="text-primary font-bold">privacy@signalpulse.com</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
