import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Subtle simulated micro-delay for smooth tactile feedback
    setTimeout(() => {
      const result = login(username, password, rememberMe);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-[#f8fafc] dark:bg-[#08090d] text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* Architectural Background Grid & Single Soft Light Cone */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-60 dark:opacity-80" />
      <div className="ambient-light-cone" />

      {/* Top Navigation Bar: Theme toggle */}
      <header className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto z-20 w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold shadow-sm border border-slate-800 dark:border-white/20">
            <svg
              className="w-4 h-4"
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
          <span className="text-sm font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
            HubSpace Atlas
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-[#121622] hover:bg-slate-100 dark:hover:bg-[#181d2d] border border-slate-200/80 dark:border-white/[0.08] transition-colors shadow-sm"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </header>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm sm:max-w-md"
      >
        <div className="rounded-2xl craft-card p-6 sm:p-8 hairline-sheen shadow-elevated dark:shadow-elevated-dark border border-slate-200 dark:border-white/[0.08]">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08] mb-3">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Private Atlas Vault
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter credentials to unlock your curated directory
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  autoFocus
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/60 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/60 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Stay authenticated on this client
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white shadow-sm disabled:opacity-60 disabled:pointer-events-none transition-all duration-150"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Local Storage (Dracula)</span>
          </div>
        </div>
      </motion.div>

      {/* Page Footer */}
      <footer className="relative z-10 py-6 text-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
        <span>HubSpace Directory • Secure Client Node</span>
      </footer>
    </div>
  );
}
