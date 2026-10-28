import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import CategoryIcon from '../common/CategoryIcon';
import LinkCardDetailed from './LinkCardDetailed';
import LinkCardCompact from './LinkCardCompact';
import LinkRowList from './LinkRowList';

export default function CategorySection({ category, links }) {
  const { viewMode, collapsedCategories, toggleCategoryCollapse, setModalState } = useLinks();

  const isCollapsed = Boolean(collapsedCategories[category.id]);

  const handleAddLinkToCategory = (e) => {
    e.stopPropagation();
    setModalState((prev) => ({
      ...prev,
      addEditOpen: true,
      editingLink: null,
      preselectedCategory: category.id,
    }));
  };

  return (
    <section className="mb-8 group/section">
      {/* Category Section Header */}
      <div
        onClick={() => toggleCategoryCollapse(category.id)}
        className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl craft-panel cursor-pointer select-none transition-all duration-150 mb-3 hover:border-slate-300 dark:hover:border-white/20"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Subtle Tonal Category Emblem */}
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
            <CategoryIcon name={category.icon} className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate tracking-tight">
                {category.name}
              </h2>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06] shrink-0">
                {links.length}
              </span>
            </div>
            {category.description && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Right side actions: Add Link and Expand/Collapse chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddLinkToCategory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20"
            title={`Add link to ${category.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Add</span>
          </button>

          <div
            className={`p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {links.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] text-center bg-slate-50/50 dark:bg-white/[0.01]">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  No bookmarks matching your filters in this category.
                </p>
                <button
                  onClick={handleAddLinkToCategory}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add a link here
                </button>
              </div>
            ) : viewMode === 'detailed' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {links.map((link) => (
                  <LinkCardDetailed key={link.id} link={link} />
                ))}
              </div>
            ) : viewMode === 'compact' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {links.map((link) => (
                  <LinkCardCompact key={link.id} link={link} />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {links.map((link) => (
                  <LinkRowList key={link.id} link={link} category={category} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
