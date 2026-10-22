import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useLinks();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl backdrop-blur-xl border ${
                isSuccess
                  ? 'bg-slate-900/90 text-white border-emerald-500/30 dark:bg-emerald-950/80 dark:border-emerald-500/40'
                  : isError
                  ? 'bg-slate-900/90 text-white border-rose-500/30 dark:bg-rose-950/80 dark:border-rose-500/40'
                  : 'bg-slate-900/90 text-white border-indigo-500/30 dark:bg-slate-900/90 dark:border-indigo-500/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
                <p className="text-sm font-medium leading-tight truncate">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

