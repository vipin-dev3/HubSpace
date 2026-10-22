import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Star, Edit2, Trash2 } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function LinkCardCompact({ link }) {
  const { togglePin, incrementClick, setModalState, addToast } = useLinks();
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
    <div className="group relative rounded-xl glass-card p-3 flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
          <FaviconImage url={link.url} title={link.title} className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementClick(link.id)}
            className="text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-500 flex items-center gap-1 truncate"
          >
            <span className="truncate">{link.title}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
          </a>
          <p className="text-[10px] text-slate-400 truncate">{domain}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            togglePin(link.id);
          }}
          className={`p-1 rounded-md transition-colors ${
            link.isPinned ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
          }`}
          title="Toggle Pin"
        >
          <Star className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400' : ''}`} />
        </button>

        <button
          onClick={handleCopy}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={handleEdit}
            className="p-1 rounded-md text-slate-400 hover:text-indigo-400 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

