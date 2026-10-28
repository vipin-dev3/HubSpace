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
  SlidersHorizontal,
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
  const categoryScrollRef = useRef(null);

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
    <div className="mb-8 space-y-4">
      {/* 1. Main Command Search Bar & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        {/* Command Search Bar */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks, domains, tags, or topics... (Press '/' to focus)"
            className="w-full pl-10 pr-24 sm:pr-28 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl craft-panel bg-white dark:bg-[#0f121a] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/60 shadow-sm transition-all font-sans"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center gap-1.5">
            {searchQuery ? (
              <>
                <span className="hidden sm:inline-flex text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {filteredLinks.length} found
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  title="Clear search (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/[0.05] rounded border border-slate-200 dark:border-white/[0.08]">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Category Dropdown Trigger */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full sm:w-auto flex items-center justify-between gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium craft-panel transition-all ${
              isDropdownOpen || selectedCategory !== 'all'
                ? 'bg-white dark:bg-[#151926] border-blue-500/50 ring-1 ring-blue-500/20 text-blue-600 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-4 h-4 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                {activeCategory ? (
                  <CategoryIcon name={activeCategory.icon} className="w-3.5 h-3.5" />
                ) : (
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                )}
              </div>

              <span className="font-medium truncate max-w-[170px] sm:max-w-[190px]">
                {activeCategory ? activeCategory.name : 'All Categories'}
              </span>

              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06]">
                {activeCategory ? counts[activeCategory.id] || 0 : counts.all}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-1 ${
                isDropdownOpen ? 'rotate-180 text-blue-500' : ''
              }`}
            />
          </button>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:right-0 mt-1.5 w-full sm:w-80 z-50 rounded-xl craft-panel shadow-elevated dark:shadow-elevated-dark border border-slate-200 dark:border-white/[0.1] overflow-hidden"
              >
                <div className="p-1.5 max-h-96 overflow-y-auto space-y-0.5">
                  {/* Option: All Categories */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">All Categories</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">
                        {counts.all}
                      </span>
                      {selectedCategory === 'all' && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-200/60 dark:border-white/[0.06]" />

                  {/* List of 13 Categories */}
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = counts[cat.id] || 0;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                            <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate text-left">{cat.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">
                            {count}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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

      {/* 2. Rapid Category Pill Rail (Instant 1-Click Filtering) */}
      <div className="relative">
        <div
          ref={categoryScrollRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth"
        >
          {/* "All" Category Pill */}
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                : 'bg-white dark:bg-[#10131d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800'
                  : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                    : 'bg-white dark:bg-[#10131d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <CategoryIcon
                  name={cat.icon}
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-blue-400 dark:text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate max-w-[130px]">{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Info Bar & Global Expand / Collapse Accordions */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1 text-xs">
        {/* Active Filter Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters ? (
            <>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Filtered:
              </span>

              {searchQuery && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs">
                  <span>"{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-blue-800 dark:hover:text-white p-0.5 rounded"
                    title="Clear query"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedCategory !== 'all' && activeCategory && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs">
                  <CategoryIcon name={activeCategory.icon} className="w-3 h-3" />
                  <span>{activeCategory.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-blue-800 dark:hover:text-white p-0.5 rounded"
                    title="Show all categories"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedTag && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.1] text-xs">
                  <Tag className="w-3 h-3" />
                  <span>#{selectedTag}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="hover:text-slate-900 dark:hover:text-white p-0.5 rounded"
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
                <span>Reset</span>
              </button>
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              Directory: {filteredLinks.length} items loaded
            </span>
          )}
        </div>

        {/* Global Expand / Collapse Accordions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setAllCategoriesCollapse(false)}
            className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            title="Expand all categories"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand All</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            type="button"
            onClick={() => setAllCategoriesCollapse(true)}
            className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
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
