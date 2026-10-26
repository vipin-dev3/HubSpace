import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  MousePointerClick,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function LinkRowList({ link }) {
  const { incrementClick, setModalState, setSelectedTag, addToast } = useLinks();
  const [copied, setCopied] = useState(false);

  const domain = extractDomain(link.url);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    addToast(`Copied URL: ${domain}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalState((prev) => ({
      ...prev,
      addEditOpen: true,
      editingLink: link,
    }));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalState((prev) => ({
      ...prev,
      deleteConfirm: link,
    }));
  };

  return (
    <div className="group rounded-xl glass-card px-4 py-3 flex items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
      {/* Favicon & Title info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
          <FaviconImage url={link.url} title={link.title} className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => incrementClick(link.id)}
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-500 flex items-center gap-1.5 truncate"
            >
              <span className="truncate">{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 shrink-0" />
            </a>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate hidden sm:inline">
              ({domain})
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block">
            {link.description || 'No description.'}
          </p>
        </div>
      </div>

      {/* Tags (Desktop) */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 max-w-xs overflow-hidden">
        {link.tags?.slice(0, 3).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Click counter */}
      <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
        <MousePointerClick className="w-3.5 h-3.5" />
        <span>{link.clickCount || 0}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
          title="Edit Bookmark"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
          title="Delete Bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => incrementClick(link.id)}
          className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-500 hover:text-white dark:bg-indigo-500/20 dark:hover:bg-indigo-600 dark:text-indigo-300 dark:hover:text-white transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

