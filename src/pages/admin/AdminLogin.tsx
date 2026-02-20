import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { SEO } from '../../components/SEO';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        addNotification('success', 'Account created successfully');
      } else {
        await signIn(email, password);
        addNotification('success', 'Welcome back');
      }
      navigate('/admin/dashboard');
    } catch (error: any) {
      addNotification('error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login - AuronexMedia" />
      <div className="min-h-screen bg-[#F5F5DC] flex relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 p-20 flex-col justify-between relative z-10">
          {/* Top Section */}
          <div>
            {/* Logo */}
            <div className="mb-32">
              <div className="inline-flex items-center gap-3 mb-16">
                <div className="w-3 h-3 bg-[#228B22] rounded-full"></div>
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat text-5xl font-black text-gray-900 tracking-tight">
                    Auronex
                  </span>
                  <span className="font-montserrat text-5xl font-light text-[#228B22] tracking-tight">
                    Media
                  </span>
                </div>
              </div>

              <h1 className="text-[120px] font-black text-gray-900 leading-none font-montserrat tracking-tighter mb-12">
                Admin<br />
                Portal
              </h1>
              <p className="text-3xl text-gray-600 font-montserrat leading-relaxed max-w-xl">
                Modern content management for teams who value simplicity and power
              </p>
            </div>

            {/* Feature List - Text Only */}
            <div className="space-y-8">
              {[
                { number: '01', label: 'Real-time Analytics', desc: 'Track performance instantly' },
                { number: '02', label: 'Team Collaboration', desc: 'Work together seamlessly' },
                { number: '03', label: 'Content Publishing', desc: 'Publish with confidence' },
              ].map((feature) => (
                <div key={feature.number} className="flex items-start gap-8 group">
                  <div className="text-8xl font-black text-gray-200 group-hover:text-[#228B22] transition-colors font-montserrat leading-none">
                    {feature.number}
                  </div>
                  <div className="pt-6">
                    <div className="text-gray-900 font-montserrat font-black text-2xl mb-2">
                      {feature.label}
                    </div>
                    <div className="text-gray-500 font-montserrat text-lg">
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-20 relative z-10">
          <div className="w-full max-w-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-16">
              <div className="w-3 h-3 bg-[#228B22] rounded-full"></div>
              <div className="flex items-baseline gap-2">
                <span className="font-montserrat text-3xl font-black text-gray-900">Auronex</span>
                <span className="font-montserrat text-3xl font-light text-[#228B22]">Media</span>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[64px] p-16 border-2 border-gray-200 shadow-2xl">
              {/* Header */}
              <div className="mb-16">
                <div className="inline-flex items-center gap-3 bg-[#228B22]/10 px-6 py-3 rounded-full mb-10">
                  <div className="w-2.5 h-2.5 bg-[#228B22] rounded-full"></div>
                  <span className="text-[#228B22] font-montserrat font-black text-sm uppercase tracking-widest">
                    Authentication
                  </span>
                </div>
                
                <h2 className="text-7xl font-black text-gray-900 mb-6 font-montserrat tracking-tight leading-none">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-500 font-montserrat text-xl">
                  {isSignUp 
                    ? 'Start your journey with AuronexMedia' 
                    : 'Continue to your dashboard'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field (Sign Up Only) */}
                {isSignUp && (
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-xs font-black text-gray-700 mb-4 font-montserrat uppercase tracking-[0.2em]"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe"
                      required
                      className={`w-full px-8 py-7 bg-gray-50 border-2 ${
                        focusedField === 'name' ? 'border-[#228B22] bg-white' : 'border-gray-200'
                      } rounded-[32px] text-gray-900 font-montserrat font-bold text-xl focus:outline-none transition-all placeholder:text-gray-400 placeholder:font-normal`}
                    />
                  </div>
                )}
                
                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-xs font-black text-gray-700 mb-4 font-montserrat uppercase tracking-[0.2em]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin@company.com"
                    required
                    className={`w-full px-8 py-7 bg-gray-50 border-2 ${
                      focusedField === 'email' ? 'border-[#228B22] bg-white' : 'border-gray-200'
                    } rounded-[32px] text-gray-900 font-montserrat font-bold text-xl focus:outline-none transition-all placeholder:text-gray-400 placeholder:font-normal`}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label 
                      htmlFor="password" 
                      className="block text-xs font-black text-gray-700 font-montserrat uppercase tracking-[0.2em]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs font-black text-[#228B22] hover:text-[#1a6b1a] font-montserrat uppercase tracking-[0.2em] transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••••••"
                    required
                    className={`w-full px-8 py-7 bg-gray-50 border-2 ${
                      focusedField === 'password' ? 'border-[#228B22] bg-white' : 'border-gray-200'
                    } rounded-[32px] text-gray-900 font-montserrat font-bold text-xl focus:outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#228B22] text-white py-8 px-10 rounded-[32px] font-montserrat font-black text-xl hover:bg-[#1a6b1a] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-12"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-8 text-xs font-montserrat font-black text-gray-400 uppercase tracking-[0.2em]">
                    or
                  </span>
                </div>
              </div>

              {/* Toggle Sign Up/Sign In */}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full py-7 px-10 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#228B22] rounded-[32px] font-montserrat font-bold text-gray-700 hover:text-[#228B22] transition-all text-lg"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
