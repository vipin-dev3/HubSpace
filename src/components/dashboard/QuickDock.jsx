import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ExternalLink, PinOff, Sparkles } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function QuickDock() {
  const { pinnedLinks, togglePin, incrementClick } = useLinks();

  if (pinnedLinks.length === 0) {
    return (
      <div className="mb-6 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-[#111522]/40 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>No pinned bookmarks yet. Click the star icon on any bookmark to add it to your Quick Access Dock!</span>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick Dock & Favorites
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {pinnedLinks.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">1-Click Launchpad</span>
      </div>

      {/* Dock Container */}
      <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/70 dark:bg-[#111522]/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {pinnedLinks.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="group relative shrink-0"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => incrementClick(link.id)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-white/5 transition-all text-slate-800 dark:text-slate-200 hover:shadow-md hover:border-indigo-500/30"
                >
                  <FaviconImage url={link.url} title={link.title} className="w-5 h-5 rounded-md" />
                  <span className="text-xs font-medium max-w-[120px] truncate">{link.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Quick Unpin Button on hover */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePin(link.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white dark:bg-slate-700 hover:bg-rose-600 dark:hover:bg-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Unpin from dock"
                >
                  <PinOff className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

