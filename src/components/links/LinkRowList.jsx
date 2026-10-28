import React, { useState } from 'react';
import {
  ArrowUpRight,
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
    addToast(`Copied: ${domain}`, 'success');
    setTimeout(() => setCopied(false), 1800);
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
    <div className="group rounded-xl craft-card px-3.5 py-2.5 flex items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-white/20">
      {/* Favicon & Title info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
          <FaviconImage url={link.url} title={link.title} className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => incrementClick(link.id)}
              className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 truncate"
            >
              <span className="truncate">{link.title}</span>
            </a>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate hidden sm:inline">
              ({domain})
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block mt-0.5">
            {link.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Tags (Desktop) */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 max-w-xs overflow-hidden">
        {link.tags?.slice(0, 3).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Launch counter */}
      <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
        <MousePointerClick className="w-3.5 h-3.5" />
        <span>{link.clickCount || 0}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          title="Copy URL"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={handleEdit}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => incrementClick(link.id)}
          className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white font-medium text-xs transition-colors shadow-sm group/launch"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/launch:translate-x-0.5 group-hover/launch:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
