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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#08090d] text-slate-900 dark:text-slate-100 transition-colors relative selection:bg-blue-500/20">
      {/* Architectural Background Grid & Single Soft Light Cone */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-60 dark:opacity-80" />
      <div className="ambient-light-cone" />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {/* Top Telemetry / Status Deck */}
        <StatsOverview />

        {/* Command Search Bar & Category Navigation */}
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
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/[0.06] py-6 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#08090d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight">HubSpace Atlas</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Curated Web & Developer Telemetry</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Secure Client Storage
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
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
