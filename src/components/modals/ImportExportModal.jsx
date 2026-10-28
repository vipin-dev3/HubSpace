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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-2xl craft-panel hairline-sheen border border-slate-200 dark:border-white/[0.1] shadow-elevated dark:shadow-elevated-dark p-6 sm:p-7 z-10 my-auto bg-white dark:bg-[#0f121a]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/[0.07] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                  Directory Data & Sync
                </h3>
                <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  Export, import, or synchronize bookmarks
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#121622] border border-slate-200/80 dark:border-white/[0.06] mb-5">
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'bg-white dark:bg-[#1b2234] text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setActiveTab('restore')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'restore'
                  ? 'bg-white dark:bg-[#1b2234] text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            <button
              onClick={() => setActiveTab('reset')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'reset'
                  ? 'bg-white dark:bg-[#1b2234] text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08]">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  Download Bookmark Archive
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Export includes all {links.length} bookmarks across {categories.length} categories formatted in clean, human-readable JSON.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 px-1">
                <span>Items: {links.length}</span>
                <span>Clusters: {categories.length}</span>
                <span>Format: .json</span>
              </div>

              <button
                onClick={exportBookmarks}
                className="w-full py-2.5 rounded-xl font-medium text-xs text-white bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON Archive</span>
              </button>
            </div>
          )}

          {activeTab === 'restore' && (
            <div className="space-y-3.5">
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
                  className="w-full py-4 border border-dashed border-slate-300 dark:border-white/[0.1] hover:border-blue-500 dark:hover:border-blue-400 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer bg-slate-50/50 dark:bg-[#0c0e15]/50"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Select a .JSON archive file
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">or paste raw JSON below</span>
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
                  rows={3}
                  placeholder='{"categories": [...], "links": [...]}'
                  className="w-full px-3 py-2 rounded-xl font-mono text-xs bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
                />
                {fileError && <p className="text-[11px] text-rose-500 mt-1">{fileError}</p>}
              </div>

              {/* Import Mode Radio */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Collision Strategy:
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-blue-600 focus:ring-blue-500"
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
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Replace (overwrite directory)</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleExecuteImport}
                disabled={!jsonText.trim()}
                className={`w-full py-2.5 rounded-xl font-medium text-xs text-white transition-all flex items-center justify-center gap-2 ${
                  jsonText.trim()
                    ? 'bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-white/[0.05] text-slate-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Apply Archive</span>
              </button>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold tracking-tight">Factory Reset</h4>
                    <p className="text-xs mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">
                      This resets HubSpace back to the default curated nodes. Any custom bookmarks created locally will be cleared.
                    </p>
                  </div>
                </div>
              </div>

              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-2.5 rounded-xl font-medium text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-sm"
                  >
                    Confirm Reset
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
