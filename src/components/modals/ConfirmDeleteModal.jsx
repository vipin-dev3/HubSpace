import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function ConfirmDeleteModal() {
  const { modalState, setModalState, deleteLink } = useLinks();
  const linkToDelete = modalState.deleteConfirm;
  const isOpen = Boolean(linkToDelete);

  if (!isOpen) return null;

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, deleteConfirm: null }));
  };

  const handleConfirm = () => {
    if (linkToDelete) {
      deleteLink(linkToDelete.id);
      handleClose();
    }
  };

  const domain = extractDomain(linkToDelete.url);

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
          className="relative w-full max-w-sm sm:max-w-md rounded-2xl craft-panel hairline-sheen border border-slate-200 dark:border-white/[0.1] shadow-elevated dark:shadow-elevated-dark p-6 z-10 my-auto bg-white dark:bg-[#0f121a]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 dark:border-white/[0.07]">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Remove Bookmark
              </h3>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target link details */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] mb-4 flex items-center gap-3">
            <FaviconImage url={linkToDelete.url} title={linkToDelete.title} className="w-5 h-5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                {linkToDelete.title}
              </p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{domain}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
            Are you sure you want to remove this bookmark node? You can re-add it anytime or restore from a backup export.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm"
            >
              Confirm Removal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
