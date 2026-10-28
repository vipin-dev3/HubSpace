import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useLinks();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto flex items-center justify-between p-3 rounded-xl shadow-elevated dark:shadow-elevated-dark bg-slate-900 text-white dark:bg-[#121622] dark:text-slate-100 border border-slate-800 dark:border-white/[0.1] backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
                <p className="text-xs font-medium leading-tight truncate">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
