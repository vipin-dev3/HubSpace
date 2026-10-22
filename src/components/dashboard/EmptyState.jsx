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
      preselectedCategory: selectedCategory !== 'all' && selectedCategory !== 'favorites' ? selectedCategory : null,
    }));
  };

  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1.5">
        No Bookmarks Found
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
        {searchQuery
          ? `We couldn't find any bookmarks matching "${searchQuery}". Try a different keyword or reset active filters.`
          : 'There are no bookmarks matching the selected category or tag filters.'}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Link</span>
        </button>
      </div>
    </div>
  );
}

