import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
  MousePointerClick,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function LinkCardDetailed({ link }) {
  const { togglePin, incrementClick, setModalState, setSelectedTag, addToast } = useLinks();
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

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag(tag);
  };

  return (
    <div className="group relative rounded-2xl glass-card p-5 flex flex-col justify-between transition-all duration-300">
      {/* Top Row: Favicon, Title, Domain & Pin/Action buttons */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 shrink-0 group-hover:scale-105 transition-transform">
              <FaviconImage url={link.url} title={link.title} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick(link.id)}
                className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 leading-snug group/link"
              >
                <span className="truncate">{link.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {domain}
              </p>
            </div>
          </div>

          {/* Quick Actions (Pin & Copy) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                togglePin(link.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                link.isPinned
                  ? 'text-amber-400 hover:bg-amber-500/10'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={link.isPinned ? 'Remove from Quick Dock' : 'Pin to Quick Dock'}
              aria-label="Toggle pin"
            >
              <Star className={`w-4 h-4 ${link.isPinned ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy URL"
              aria-label="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {link.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Row: Tags & Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
        {/* Tag Badges */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {link.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/20 transition-all border border-transparent"
                title={`Filter by tag #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500" title="Click count">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>{link.clickCount || 0} clicks</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
              title="Edit Bookmark"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Delete Bookmark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => incrementClick(link.id)}
              className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-500/20 dark:hover:bg-indigo-600 dark:text-indigo-300 dark:hover:text-white font-medium text-xs transition-colors"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

