import React from 'react';
import { SearchX, Plus, RotateCcw } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function EmptyState() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, setSelectedTag, setModalState } = useLinks();

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag(null);
  };

  const handleOpenAddModal = () => {
    setModalState((prev) => ({
      ...prev,
      addEditOpen: true,
      editingLink: null,
      preselectedCategory: selectedCategory !== 'all' ? selectedCategory : null,
    }));
  };

  return (
    <div className="py-16 px-4 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 mx-auto mb-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 flex items-center justify-center">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 tracking-tight">
        No Matching Resources Found
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
        {searchQuery
          ? `No bookmarks match "${searchQuery}". Check the spelling or reset active filters.`
          : 'No bookmarks exist for the currently selected filter.'}
      </p>

      <div className="flex items-center justify-center gap-2.5">
        <button
          onClick={handleClearFilters}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#121622] hover:bg-slate-50 dark:hover:bg-[#181d2d] border border-slate-200 dark:border-white/[0.08] transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

        <button
          onClick={handleOpenAddModal}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Node</span>
        </button>
      </div>
    </div>
  );
}
