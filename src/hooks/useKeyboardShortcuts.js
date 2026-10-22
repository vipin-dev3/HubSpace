import { useEffect } from 'react';

export function useKeyboardShortcuts({ onSearchFocus, onAddLink, onClearSearch }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is inside an input, textarea, or contentEditable
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Escape key: clear search or close active modal
      if (e.key === 'Escape') {
        if (onClearSearch) onClearSearch();
        return;
      }

      // Cmd+K or Ctrl+K or '/' to search
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        if (onSearchFocus) onSearchFocus();
        return;
      }

      // Alt+N to open Add Link modal
      if (e.altKey && (e.key === 'n' || e.key === 'N') && !isInput) {
        e.preventDefault();
        if (onAddLink) onAddLink();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchFocus, onAddLink, onClearSearch]);
}

