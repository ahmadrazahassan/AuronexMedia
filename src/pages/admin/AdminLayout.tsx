import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Top Header */}
      <header className="bg-transparent px-8 py-6 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl"></div>
            <span className="text-2xl font-black text-gray-900 font-montserrat-alt">Signal Pulse</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Live Badge */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gray-900 font-elms">Live</span>
            </div>

            {/* Stats Badge */}
            <div className="bg-primary px-4 py-2 rounded-full">
              <span className="text-sm font-black text-white font-montserrat-alt">
                {new Date().getFullYear()}
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <span className="text-white text-sm font-bold font-montserrat-alt">
                  {profile?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-200 py-2 z-20">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 font-montserrat-alt">{profile?.name}</p>
                      <p className="text-xs text-gray-500 mt-1 font-elms">{profile?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors font-elms font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-32">
        <Outlet />
      </main>
    </div>
  );
};
