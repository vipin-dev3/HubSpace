import React from 'react';
import {
  Sparkles,
  Star,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import CategoryIcon from '../common/CategoryIcon';

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
  } = useLinks();

  // Compute counts per category
  const counts = React.useMemo(() => {
    const map = { all: links.length, favorites: 0 };
    categories.forEach((cat) => {
      map[cat.id] = 0;
    });
    links.forEach((l) => {
      if (l.isPinned) map.favorites += 1;
      if (map[l.categoryId] !== undefined) {
        map[l.categoryId] += 1;
      }
    });
    return map;
  }, [categories, links]);

  return (
    <div className="mb-8 space-y-4">
      {/* Category Filter Pills Container */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar w-full sm:w-auto">
          {/* "All" Filter Pill */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all' && !selectedTag
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                : 'bg-white/80 dark:bg-[#121624] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 hover:border-indigo-400/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' && !selectedTag
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* "Favorites" Filter Pill */}
          <button
            onClick={() => {
              setSelectedCategory('favorites');
              setSelectedTag(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'favorites' && !selectedTag
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-500/20'
                : 'bg-white/80 dark:bg-[#121624] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 hover:border-amber-400/40'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                selectedCategory === 'favorites' ? 'fill-white' : 'text-amber-400 fill-amber-400/30'
              }`}
            />
            <span>Favorites</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'favorites' && !selectedTag
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {counts.favorites}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id && !selectedTag;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTag(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                    : 'bg-white/80 dark:bg-[#121624] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 hover:border-indigo-400/40'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Expand/Collapse Accordions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAllCategoriesCollapse(false)}
            className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
            title="Expand all categories"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand All</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={() => setAllCategoriesCollapse(true)}
            className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
            title="Collapse all categories"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collapse All</span>
          </button>
        </div>
      </div>

      {/* Active Filter Indicators (Tag or Search Query) */}
      {(selectedTag || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-slate-400">Filtering:</span>

          {searchQuery && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs">
              <span>Query: "{searchQuery}"</span>
              <span className="font-semibold text-[10px] bg-indigo-500/20 px-1.5 rounded-full">
                {filteredLinks.length} results
              </span>
            </div>
          )}

          {selectedTag && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs">
              <Tag className="w-3 h-3" />
              <span>Tag: #{selectedTag}</span>
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:text-purple-700 dark:hover:text-white p-0.5 rounded"
                title="Remove tag filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

