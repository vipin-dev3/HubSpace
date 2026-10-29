import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSelector({ align = 'right', showLabel = true }) {
  const { theme, setTheme, activeThemeMeta, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium craft-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/80 dark:border-white/[0.08]"
        title={`Current theme: ${activeThemeMeta.name} (${activeThemeMeta.tag})`}
        aria-label="Select color theme"
      >
        {/* Active Theme Color Swatch */}
        <div className="flex items-center -space-x-1 shrink-0">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs"
            style={{ backgroundColor: activeThemeMeta.colors.bg }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs ring-1 ring-white/10"
            style={{ backgroundColor: activeThemeMeta.colors.accent }}
          />
        </div>

        {showLabel && (
          <span className="hidden sm:inline font-medium tracking-tight">
            {activeThemeMeta.name}
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Theme Selection Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-1.5 w-64 sm:w-72 z-50 rounded-2xl craft-panel shadow-elevated dark:shadow-elevated-dark border border-slate-200 dark:border-white/[0.1] overflow-hidden`}
          >
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                <Palette className="w-3.5 h-3.5 text-blue-500" />
                <span>Theme Aesthetics</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                {availableThemes.length} presets
              </span>
            </div>

            {/* List of themes */}
            <div className="p-1.5 max-h-80 overflow-y-auto space-y-1">
              {availableThemes.map((item) => {
                const isSelected = item.id === theme;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTheme(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-all text-left group ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-white/[0.08] font-semibold text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Swatch Pill */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 border border-slate-300/40 dark:border-white/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: item.colors.bg }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs ring-1 ring-white/20"
                          style={{ backgroundColor: item.colors.accent }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold">{item.name}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 shrink-0">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 w-4 h-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

