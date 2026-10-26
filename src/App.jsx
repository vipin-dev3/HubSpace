import React, { useMemo } from 'react';
import Header from './components/dashboard/Header';
import StatsOverview from './components/dashboard/StatsOverview';
import FilterBar from './components/dashboard/FilterBar';
import EmptyState from './components/dashboard/EmptyState';
import CategorySection from './components/links/CategorySection';
import AddEditLinkModal from './components/modals/AddEditLinkModal';
import ImportExportModal from './components/modals/ImportExportModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';
import ToastContainer from './components/common/Toast';
import LoginPage from './components/auth/LoginPage';
import { useLinks } from './context/LinksContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();
  const { categories, filteredLinks, selectedCategory } = useLinks();

  // Group filtered links by category
  const linksByCategory = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = [];
    });

    filteredLinks.forEach((link) => {
      if (map[link.categoryId]) {
        map[link.categoryId].push(link);
      } else {
        map[link.categoryId] = [link];
      }
    });

    return map;
  }, [categories, filteredLinks]);

  // Categories to display based on selected filter
  const visibleCategories = useMemo(() => {
    if (selectedCategory !== 'all') {
      return categories.filter((cat) => cat.id === selectedCategory);
    }

    // "all": show categories that have matching links (or show all if no search query)
    return categories.filter((cat) => (linksByCategory[cat.id]?.length || 0) > 0);
  }, [categories, selectedCategory, linksByCategory]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {/* Top Stats Overview */}
        <StatsOverview />

        {/* Search Bar & Category Dropdown Section */}
        <FilterBar />

        {/* Categorized Sections */}
        {filteredLinks.length === 0 || visibleCategories.length === 0 ? (
          <EmptyState />
        ) : (
          visibleCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              links={linksByCategory[category.id] || []}
            />
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">HubSpace</span>
            <span>—</span>
            <span>Organize & access categorized web links in one central place</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Local Browser Storage</span>
            <span>•</span>
            <span>Instant Search (Fuse.js)</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </div>
        </div>
      </footer>

      {/* Modals & Floating Overlays */}
      <AddEditLinkModal />
      <ImportExportModal />
      <ConfirmDeleteModal />
      <ToastContainer />
    </div>
  );
}
