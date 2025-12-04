import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Notification } from './components/Notification';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { CategoryPostsPage } from './pages/public/CategoryPostsPage';
import { TagsPage } from './pages/public/TagsPage';
import { TagPostsPage } from './pages/public/TagPostsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { CareersPage } from './pages/public/CareersPage';
import { AdvertisePage } from './pages/public/AdvertisePage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { CookiesPage } from './pages/public/CookiesPage';
import { LicensesPage } from './pages/public/LicensesPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { PostsList } from './pages/admin/PostsList';
import { PostCreate } from './pages/admin/PostCreate';
import { PostEdit } from './pages/admin/PostEdit';
import { HTMLImport } from './pages/admin/HTMLImport';
import { CategoriesList } from './pages/admin/CategoriesList';
import { TagsList } from './pages/admin/TagsList';
import { CommentsList } from './pages/admin/CommentsList';
import { ContactsList } from './pages/admin/ContactsList';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ErrorBoundary>
      <Notification />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryPostsPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/tags/:slug" element={<TagPostsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/licenses" element={<LicensesPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostCreate />} />
          <Route path="posts/:id/edit" element={<PostEdit />} />
          <Route path="posts/import" element={<HTMLImport />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="tags" element={<TagsList />} />
          <Route path="comments" element={<CommentsList />} />
          <Route path="contacts" element={<ContactsList />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
