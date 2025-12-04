import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Button } from '../../components/Button';
import { SEO } from '../../components/SEO';
import { supabase } from '../../lib/supabase';
import { useNotificationStore } from '../../store/notificationStore';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }]);

      if (error) throw error;

      addNotification('success', 'Message sent successfully! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification('error', 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact - Signal Pulse"
        description="Get in touch with us. We'd love to hear from you!"
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
                GET IN TOUCH
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-montserrat text-primary leading-tight">
              Let's Start a<br/>Conversation
            </h1>
            <p className="text-xl md:text-2xl text-secondary font-sf-pro max-w-2xl mx-auto leading-relaxed">
              Have a question, suggestion, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary font-montserrat mb-4">Send Us a Message</h2>
                  <p className="text-secondary font-sf-pro">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white border border-gray-200 p-8 space-y-6">
                    <Input
                      label="Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      fullWidth
                      required
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      fullWidth
                      required
                    />
                    <Textarea
                      label="Message *"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      fullWidth
                      required
                    />
                    <Button type="submit" loading={submitting} fullWidth size="lg">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-primary mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2 font-montserrat">Email</h3>
                    <a href="mailto:hello@signalpulse.blog" className="text-secondary hover:text-primary font-sf-pro transition-colors">
                      hello@signalpulse.blog
                    </a>
                  </div>
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="w-12 h-12 bg-primary mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2 font-montserrat">Location</h3>
                    <p className="text-secondary font-sf-pro">
                      San Francisco, CA<br/>
                      United States
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-primary mb-4 font-montserrat">Follow Us</h3>
                    <div className="flex gap-4">
                      <a href="https://twitter.com/signalpulse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a href="https://linkedin.com/company/signalpulse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a href="https://github.com/signalpulse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-primary text-white p-8">
                  <h3 className="text-xl font-bold mb-4 font-montserrat">Response Time</h3>
                  <p className="text-gray-200 font-sf-pro leading-relaxed mb-6">
                    We typically respond within 24 hours during business days. For urgent matters, please mention it in your message.
                  </p>
                  <div className="space-y-2 text-gray-200 font-sf-pro text-sm">
                    <p>Monday - Friday: 9AM - 6PM PST</p>
                    <p>Saturday: 10AM - 4PM PST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
