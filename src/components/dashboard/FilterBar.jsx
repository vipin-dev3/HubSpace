import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Tag,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import CategoryIcon from '../common/CategoryIcon';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export default function FilterBar() {
  const {
    categories,
    links,
    filteredLinks,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    setAllCategoriesCollapse,
    searchQuery,
    setSearchQuery,
  } = useLinks();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Compute count of bookmarks per category
  const counts = useMemo(() => {
    const map = { all: links.length };
    categories.forEach((cat) => {
      map[cat.id] = 0;
    });
    links.forEach((l) => {
      if (map[l.categoryId] !== undefined) {
        map[l.categoryId] += 1;
      }
    });
    return map;
  }, [categories, links]);

  // Current active category metadata
  const activeCategory = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => c.id === selectedCategory) || null;
  }, [categories, selectedCategory]);

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Keyboard shortcut listener to focus search bar
  useKeyboardShortcuts({
    onSearchFocus: () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    onClearSearch: () => setSearchQuery(''),
  });

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null);
    setIsDropdownOpen(false);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedTag || selectedCategory !== 'all');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag(null);
  };

  return (
    <div className="mb-8 space-y-3.5">
      {/* Search Bar & Category Dropdown Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* 1. Enhanced Search Section */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links, tags, URLs, categories... (Press '/' to focus)"
            className="w-full pl-10 sm:pl-11 pr-24 sm:pr-28 py-2.5 sm:py-3 text-xs sm:text-sm rounded-2xl glass-card bg-white/80 dark:bg-[#121624]/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 shadow-sm transition-all"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center gap-2">
            {searchQuery ? (
              <>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {filteredLinks.length} found
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Clear search (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700/60 shadow-sm">
                Ctrl + K
              </kbd>
            )}
          </div>
        </div>

        {/* 2. Category Selection Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-medium glass-card transition-all ${
              isDropdownOpen || selectedCategory !== 'all'
                ? 'bg-white dark:bg-[#151a2d] border-indigo-500/40 ring-2 ring-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                : 'bg-white/80 dark:bg-[#121624]/90 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-indigo-400/40'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {activeCategory ? (
                  <CategoryIcon name={activeCategory.icon} className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                ) : (
                  <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                )}
              </div>

              <span className="font-semibold truncate max-w-[180px] sm:max-w-[200px]">
                {activeCategory ? activeCategory.name : 'All Categories'}
              </span>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                {activeCategory ? counts[activeCategory.id] || 0 : counts.all}
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-indigo-500' : ''
              }`}
            />
          </button>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:right-0 mt-2 w-full sm:w-80 z-50 rounded-2xl glass-panel shadow-2xl border border-slate-200/80 dark:border-white/15 overflow-hidden"
              >
                <div className="p-2 max-h-96 overflow-y-auto space-y-1">
                  {/* Option: All Categories */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">All Categories</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {counts.all}
                      </span>
                      {selectedCategory === 'all' && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-200/60 dark:border-white/10" />

                  {/* List of 12 Categories */}
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = counts[cat.id] || 0;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${cat.badgeClass}`}
                          >
                            <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate text-left">{cat.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {count}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter Info Bar & Accordion Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1 text-xs">
        {/* Active Filter Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters ? (
            <>
              <span className="text-slate-400 text-xs">Active:</span>

              {searchQuery && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs">
                  <span>Query: "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-indigo-800 dark:hover:text-white p-0.5 rounded"
                    title="Clear query"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedCategory !== 'all' && activeCategory && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs">
                  <CategoryIcon name={activeCategory.icon} className="w-3 h-3" />
                  <span>{activeCategory.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-indigo-800 dark:hover:text-white p-0.5 rounded"
                    title="Show all categories"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedTag && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs">
                  <Tag className="w-3 h-3" />
                  <span>#{selectedTag}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="hover:text-purple-700 dark:hover:text-white p-0.5 rounded"
                    title="Remove tag filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2 ml-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              Showing {filteredLinks.length} links across {categories.length} categories
            </span>
          )}
        </div>

        {/* Global Expand / Collapse Accordions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setAllCategoriesCollapse(false)}
            className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
            title="Expand all categories"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand All</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setAllCategoriesCollapse(true)}
            className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
            title="Collapse all categories"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collapse All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
