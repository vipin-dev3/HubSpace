import React, { useState } from 'react';
import {
  ArrowUpRight,
  Copy,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import FaviconImage from '../common/FaviconImage';
import { extractDomain } from '../../utils/urlHelper';

export default function LinkCardDetailed({ link }) {
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

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag(tag);
  };

  return (
    <div className="group relative rounded-xl craft-card p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-200">
      {/* Top Section: Favicon, Title, Domain & Copy */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3 min-w-0">
            {/* Favicon container */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
              <FaviconImage url={link.url} title={link.title} className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick(link.id)}
                className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 leading-snug group/link"
              >
                <span className="truncate">{link.title}</span>
              </a>
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {domain}
              </p>
            </div>
          </div>

          {/* Quick Copy Action */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors shrink-0"
            title="Copy URL"
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3.5">
          {link.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Section: Tags & Action Telemetry */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
        {/* Tag Badges */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {link.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/20 border border-slate-200/60 dark:border-white/[0.06] transition-colors"
                title={`Filter by tag #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums"
            title="Total launches"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>{link.clickCount || 0} launches</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Edit Bookmark"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Delete Bookmark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => incrementClick(link.id)}
              className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white font-medium text-xs transition-colors shadow-sm group/open"
            >
              <span>Launch</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/open:translate-x-0.5 group-hover/open:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
