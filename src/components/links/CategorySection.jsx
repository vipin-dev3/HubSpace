import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Sparkles } from 'lucide-react';
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
    <section className="mb-10 group/section">
      {/* Category Header / Accordion Trigger */}
      <div
        onClick={() => toggleCategoryCollapse(category.id)}
        className="flex items-center justify-between p-4 rounded-2xl glass-panel cursor-pointer select-none hover:border-indigo-500/40 transition-all duration-200 mb-4"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${category.badgeClass}`}
            style={{
              boxShadow: `0 0 15px ${category.glowColor || 'rgba(99, 102, 241, 0.2)'}`,
            }}
          >
            <CategoryIcon name={category.icon} className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
                {category.name}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                {links.length}
              </span>
            </div>
            {category.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Right side actions: Add Link and Expand/Collapse chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddLinkToCategory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white transition-all border border-indigo-500/20"
            title={`Add link to ${category.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <div
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Accordion Content with Animated Collapse */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {links.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center bg-slate-50/50 dark:bg-[#111522]/30">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  No bookmarks matching your filters in this category.
                </p>
                <button
                  onClick={handleAddLinkToCategory}
                  className="text-xs text-indigo-500 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add a new link here
                </button>
              </div>
            ) : viewMode === 'detailed' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {links.map((link) => (
                  <LinkCardDetailed key={link.id} link={link} />
                ))}
              </div>
            ) : viewMode === 'compact' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {links.map((link) => (
                  <LinkCardCompact key={link.id} link={link} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
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

