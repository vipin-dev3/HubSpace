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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 shadow-2xl p-6 z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5 text-rose-500">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Bookmark</h3>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target link details */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181e2e] border border-slate-200/80 dark:border-white/5 mb-5 flex items-center gap-3">
            <FaviconImage url={linkToDelete.url} title={linkToDelete.title} className="w-6 h-6" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                {linkToDelete.title}
              </p>
              <p className="text-xs text-slate-400 font-mono truncate">{domain}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Are you sure you want to remove this bookmark from HubSpace? This action can only be restored if you exported a backup JSON.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all"
            >
              Delete Bookmark
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

