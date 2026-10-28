import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Edit2, Trash2 } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function LinkCardCompact({ link }) {
  const { incrementClick, setModalState, addToast } = useLinks();
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
    <div className="group relative rounded-xl craft-card p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-all">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
          <FaviconImage url={link.url} title={link.title} className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementClick(link.id)}
            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 truncate leading-tight group/link"
          >
            <span className="truncate">{link.title}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover/link:text-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
          </a>
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {domain}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={handleCopy}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          title="Copy URL"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>

        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={handleEdit}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
