import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SEO } from '../../components/SEO';

export const CookiesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="Cookie Policy | Signal Pulse"
        description="Learn about how Signal Pulse uses cookies and similar technologies on our website."
      />

      <section className="relative pt-32 pb-16 bg-white border-b-4 border-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dark mb-8">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">Legal</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold font-montserrat text-dark leading-[0.95] mb-8">
              Cookie<span className="block text-primary mt-2">Policy</span>
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
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-white border-2 border-dark">
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-3">Essential Cookies</h3>
                  <p className="text-gray-700 font-sf-pro">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>

                <div className="p-6 bg-white border-2 border-dark">
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 font-sf-pro">
                    Help us understand how visitors interact with our website by collecting anonymous information.
                  </p>
                </div>

                <div className="p-6 bg-white border-2 border-dark">
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-3">Preference Cookies</h3>
                  <p className="text-gray-700 font-sf-pro">
                    Remember your settings and preferences to provide a personalized experience.
                  </p>
                </div>

                <div className="p-6 bg-white border-2 border-dark">
                  <h3 className="text-xl font-bold font-montserrat text-dark mb-3">Marketing Cookies</h3>
                  <p className="text-gray-700 font-sf-pro">
                    Track your activity to deliver relevant advertisements and measure their effectiveness.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-6">Managing Cookies</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="space-y-3">
                {['Browser Settings: Most browsers allow you to refuse or delete cookies', 'Cookie Consent Tool: Use our cookie banner to manage preferences', 'Opt-Out Links: Some third-party services provide opt-out mechanisms', 'Do Not Track: Enable this browser setting to signal your preference'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="text-gray-700 font-sf-pro text-lg pt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 border-l-4 border-primary">
              <h2 className="text-3xl font-bold font-montserrat text-dark mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 font-sf-pro leading-relaxed text-lg">
                We use services from third parties (such as Google Analytics, social media platforms) that may set their own cookies. We do not control these cookies and recommend reviewing their privacy policies.
              </p>
            </div>

            <div className="p-8 bg-noise-dark text-white border-4 border-dark">
              <h2 className="text-3xl font-bold font-montserrat mb-4">Questions?</h2>
              <p className="font-sf-pro leading-relaxed text-lg">
                If you have questions about our use of cookies, please contact us at <span className="text-primary font-bold">privacy@signalpulse.com</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
