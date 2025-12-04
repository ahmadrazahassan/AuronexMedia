import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const navItems = [
    { path: '/admin/dashboard', label: 'Overview' },
    { path: '/admin/posts', label: 'Posts' },
    { path: '/admin/posts/import', label: 'HTML Import', highlight: true },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/tags', label: 'Tags' },
    { path: '/admin/comments', label: 'Comments' },
    { path: '/admin/contacts', label: 'Messages' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AuronexMedia
            </h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? item.highlight
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                    : item.highlight
                    ? 'text-primary hover:bg-primary/10'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span>↗</span>
          View site
        </a>
      </div>
    </aside>
  );
};
