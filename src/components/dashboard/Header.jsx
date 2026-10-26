import React from 'react';
import {
  Plus,
  Moon,
  Sun,
  LayoutGrid,
  Grid3X3,
  List,
  DownloadCloud,
  Compass,
  LogOut,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { logout } = useAuth();
  const {
    viewMode,
    setViewMode,
    setModalState,
  } = useLinks();

  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0a0d14]/80 border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse-subtle" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-700 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                  HubSpace
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
                  Directory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Centralized Web & Developer Bookmarks
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* View Switcher Segmented Control */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#121624] border border-slate-200/80 dark:border-white/10">
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'detailed'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Detailed Cards View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Compact Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export / Import Button */}
            <button
              onClick={() => setModalState((prev) => ({ ...prev, importExportOpen: true }))}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-[#121624] hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 transition-colors flex items-center gap-1.5"
              title="Backup / Restore Bookmarks (JSON)"
            >
              <DownloadCloud className="w-4 h-4 text-indigo-500" />
              <span className="hidden xl:inline">Data</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#121624] hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 transition-colors"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#121624] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 border border-slate-200/80 dark:border-white/10 transition-colors flex items-center gap-1.5"
              title="Sign Out (Dracula)"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Logout</span>
            </button>

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
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Link</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

