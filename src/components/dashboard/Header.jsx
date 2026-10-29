import React from 'react';
import {
  Plus,
  LayoutGrid,
  Grid3X3,
  List,
  DownloadCloud,
  LogOut,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import { useAuth } from '../../context/AuthContext';
import ThemeSelector from '../common/ThemeSelector';

export default function Header() {
  const { logout } = useAuth();
  const {
    viewMode,
    setViewMode,
    setModalState,
  } = useLinks();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl craft-panel border-b border-slate-200/80 dark:border-white/[0.07] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group flex items-center justify-center">
              {/* Bespoke Geometric Nexus Emblem */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold shadow-sm transition-transform duration-200 group-hover:scale-105 border border-slate-800 dark:border-white/20">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                  <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                  <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
                  HubSpace
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-medium tracking-wide uppercase rounded bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-500/20">
                  Atlas
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block tracking-tight">
                Curated Digital Intelligence & Resources
              </p>
            </div>
          </div>

          {/* Right Action Tools & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* View Switcher Segmented Control */}
            <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-100 dark:bg-[#121622] border border-slate-200/80 dark:border-white/[0.08]">
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-white dark:bg-[#1b2234] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Detailed Cards View"
                aria-label="Detailed cards view"
              >
                <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-[#1b2234] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Compact Grid View"
                aria-label="Compact grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1b2234] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="List View"
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Export / Import Button */}
            <button
              onClick={() => setModalState((prev) => ({ ...prev, importExportOpen: true }))}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-slate-100/80 dark:bg-[#121622] hover:bg-slate-200/70 dark:hover:bg-[#181d2d] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08] transition-colors flex items-center gap-1.5"
              title="Backup / Restore Bookmarks (JSON)"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden xl:inline text-[11px] font-mono">Sync</span>
            </button>

            {/* Theme Selector Palette */}
            <ThemeSelector align="right" />

            {/* User Session Pill & Logout */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200/80 dark:border-white/[0.08]">
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-[#121622] border border-slate-200/80 dark:border-white/[0.08] text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Dracula</span>
              </div>

              <button
                onClick={logout}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all flex items-center gap-1"
                title="Sign Out (Dracula)"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Logout</span>
              </button>
            </div>

            {/* + Add Link Action Button */}
            <button
              onClick={() =>
                setModalState((prev) => ({
                  ...prev,
                  addEditOpen: true,
                  editingLink: null,
                  preselectedCategory: null,
                }))
              }
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2 rounded-xl font-medium text-xs sm:text-xs text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm border border-blue-500/30 transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-semibold">New Link</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
