import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Terms of Service | Signal Pulse"
        description="Read our terms of service to understand the rules and regulations for using Signal Pulse."
      />

      <section className="relative pt-32 pb-16 bg-white border-b-4 border-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">Legal</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Terms of<span className="block text-primary mt-2">Service</span>
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
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                By accessing Signal Pulse, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
              </p>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">Use License</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg mb-4">
                Permission is granted to temporarily access the materials on Signal Pulse for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title. Under this license, you may not:
              </p>
              <ul className="space-y-2 text-gray-700 font-sf-pro text-lg">
                <li>• Modify or copy the materials</li>
                <li>• Use materials for commercial purposes</li>
                <li>• Attempt to reverse engineer any software</li>
                <li>• Remove copyright or proprietary notations</li>
              </ul>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Content Policy</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                All content published on Signal Pulse is owned by us or licensed to us. You may not reproduce, distribute, or create derivative works from our content without explicit permission.
              </p>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">User Conduct</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg mb-4">
                When using our services, you agree not to:
              </p>
              <ul className="space-y-2 text-gray-700 font-sf-pro text-lg">
                <li>• Post offensive, abusive, or illegal content</li>
                <li>• Harass or threaten other users</li>
                <li>• Spam or send unsolicited communications</li>
                <li>• Violate any applicable laws or regulations</li>
              </ul>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Disclaimer</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                The materials on Signal Pulse are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties including implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Limitations</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                In no event shall Signal Pulse or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use our materials.
              </p>
            </div>

            <div className="p-8 bg-noise-dark text-white border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat mb-4">Contact</h2>
              <p className="font-sf-pro leading-relaxed text-lg">
                Questions about the Terms of Service? Contact us at <span className="text-primary font-bold">legal@signalpulse.com</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
