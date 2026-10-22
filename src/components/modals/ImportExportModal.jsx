import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function ImportExportModal() {
  const {
    modalState,
    setModalState,
    exportBookmarks,
    importBookmarks,
    resetToDefaultData,
    links,
    categories,
  } = useLinks();

  const isOpen = modalState.importExportOpen;
  const [activeTab, setActiveTab] = useState('backup'); // 'backup' | 'restore' | 'reset'
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'
  const [jsonText, setJsonText] = useState('');
  const [fileError, setFileError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, importExportOpen: false }));
    setJsonText('');
    setFileError('');
    setShowResetConfirm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setFileError('Please select a valid .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        // Test parsing
        JSON.parse(content);
        setJsonText(content);
        setFileError('');
      } catch (err) {
        setFileError('Invalid JSON structure: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!jsonText.trim()) {
      setFileError('Please paste JSON data or select a file first.');
      return;
    }

    const success = importBookmarks(jsonText, importMode);
    if (success) {
      handleClose();
    }
  };

  const handleExecuteReset = () => {
    resetToDefaultData();
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Data Management & Sync
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Export, import, or reset your categorized directory
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#181e2e] mb-6">
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setActiveTab('restore')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'restore'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={() => setActiveTab('reset')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'reset'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Ready to download your bookmarks
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Export includes all {links.length} bookmarks and {categories.length} categories formatted in clean, human-readable JSON.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 p-2">
                <span>Bookmarks: {links.length}</span>
                <span>Categories: {categories.length}</span>
                <span>Format: .json</span>
              </div>

              <button
                onClick={exportBookmarks}
                className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Download className="w-4 h-4" />
                <span>Export Bookmarks Now</span>
              </button>
            </div>
          )}

          {activeTab === 'restore' && (
            <div className="space-y-4">
              {/* File Upload Trigger */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click to select a .JSON bookmark file
                  </span>
                  <span className="text-[11px] text-slate-400">or paste the JSON content below</span>
                </button>
              </div>

              {/* Raw JSON textarea */}
              <div>
                <textarea
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    if (fileError) setFileError('');
                  }}
                  rows={4}
                  placeholder='{"categories": [...], "links": [...]}'
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-xs bg-slate-50 dark:bg-[#181e2e] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                />
                {fileError && <p className="text-xs text-rose-500 mt-1">{fileError}</p>}
              </div>

              {/* Import Mode Radio */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181e2e] border border-slate-200/80 dark:border-white/5 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Import Mode:
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Merge (combine with existing)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Replace (overwrite everything)</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleExecuteImport}
                disabled={!jsonText.trim()}
                className={`w-full py-3 rounded-xl font-semibold text-xs text-white transition-all flex items-center justify-center gap-2 ${
                  jsonText.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 hover:scale-[1.01]'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Import and Apply Bookmarks</span>
              </button>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Reset Confirmation</h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      This will reset HubSpace back to the curated developer & design bookmarks. Any custom links you created will be replaced.
                    </p>
                  </div>
                </div>
              </div>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 rounded-xl font-semibold text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Default Bookmarks</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all"
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

