import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const LicensesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Licenses & Attributions | Signal Pulse"
        description="Third-party licenses and attributions for Signal Pulse."
      />

      <section className="relative pt-32 pb-16 bg-white border-b-4 border-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">Legal</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Licenses &<span className="block text-primary mt-2">Attributions</span>
            </h1>

            <div className="w-24 h-1 bg-primary mb-6"></div>
            <p className="text-lg text-gray-600 font-sf-pro">Open source software and third-party licenses</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Open Source Software</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                Signal Pulse is built using various open source libraries and frameworks. We are grateful to the open source community for their contributions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 border-4 border-dark">
                <h3 className="text-2xl font-bold font-montserrat text-dark mb-2">React</h3>
                <p className="text-sm text-gray-600 font-sf-pro mb-3">MIT License</p>
                <p className="text-gray-700 font-sf-pro">
                  A JavaScript library for building user interfaces. Copyright (c) Facebook, Inc. and its affiliates.
                </p>
              </div>

              <div className="p-6 border-4 border-dark">
                <h3 className="text-2xl font-bold font-montserrat text-dark mb-2">React Router</h3>
                <p className="text-sm text-gray-600 font-sf-pro mb-3">MIT License</p>
                <p className="text-gray-700 font-sf-pro">
                  Declarative routing for React applications. Copyright (c) React Training.
                </p>
              </div>

              <div className="p-6 border-4 border-dark">
                <h3 className="text-2xl font-bold font-montserrat text-dark mb-2">Tailwind CSS</h3>
                <p className="text-sm text-gray-600 font-sf-pro mb-3">MIT License</p>
                <p className="text-gray-700 font-sf-pro">
                  A utility-first CSS framework. Copyright (c) Tailwind Labs, Inc.
                </p>
              </div>

              <div className="p-6 border-4 border-dark">
                <h3 className="text-2xl font-bold font-montserrat text-dark mb-2">Supabase</h3>
                <p className="text-sm text-gray-600 font-sf-pro mb-3">Apache License 2.0</p>
                <p className="text-gray-700 font-sf-pro">
                  Open source Firebase alternative providing database and authentication services.
                </p>
              </div>

              <div className="p-6 border-4 border-dark">
                <h3 className="text-2xl font-bold font-montserrat text-dark mb-2">TypeScript</h3>
                <p className="text-sm text-gray-600 font-sf-pro mb-3">Apache License 2.0</p>
                <p className="text-gray-700 font-sf-pro">
                  A typed superset of JavaScript. Copyright (c) Microsoft Corporation.
                </p>
              </div>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">Fonts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-2">Montserrat</h3>
                  <p className="text-gray-700 font-sf-pro">
                    Designed by Julieta Ulanovsky. Licensed under the SIL Open Font License.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-2">SF Pro</h3>
                  <p className="text-gray-700 font-sf-pro">
                    System font by Apple Inc. Used for interface design.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Icons & Graphics</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                Icons used throughout the site are from Lucide Icons (ISC License) and custom-designed graphics by our team.
              </p>
            </div>

            <div className="p-8 bg-noise-dark text-white border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat mb-4">Full License Information</h2>
              <p className="font-sf-pro leading-relaxed text-lg">
                For complete license texts and additional information, please visit our GitHub repository or contact <span className="text-primary font-bold">legal@signalpulse.com</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
