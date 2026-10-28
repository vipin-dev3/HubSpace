import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Plus } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import { formatUrl, isValidUrl, extractDomain } from '../../utils/urlHelper';
import FaviconImage from '../common/FaviconImage';

export default function AddEditLinkModal() {
  const { modalState, setModalState, categories, addLink, updateLink } = useLinks();
  const isOpen = modalState.addEditOpen;
  const editingLink = modalState.editingLink;
  const isEditing = Boolean(editingLink);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [urlError, setUrlError] = useState('');

  // Populate or reset form whenever modal opens or editingLink changes
  useEffect(() => {
    if (isOpen) {
      if (editingLink) {
        setTitle(editingLink.title || '');
        setUrl(editingLink.url || '');
        setDescription(editingLink.description || '');
        setCategoryId(editingLink.categoryId || categories[0]?.id || 'ai-tools');
        setTags(editingLink.tags || []);
      } else {
        setTitle('');
        setUrl('');
        setDescription('');
        setCategoryId(modalState.preselectedCategory || categories[0]?.id || 'ai-tools');
        setTags([]);
      }
      setUrlError('');
      setNewTagInput('');
    }
  }, [isOpen, editingLink, modalState.preselectedCategory, categories]);

  if (!isOpen) return null;

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, addEditOpen: false, editingLink: null }));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setUrlError('URL is required');
      return;
    }

    const formattedUrl = formatUrl(url);
    if (!isValidUrl(formattedUrl)) {
      setUrlError('Please enter a valid website address');
      return;
    }

    const linkTitle = title.trim() || extractDomain(formattedUrl);

    if (isEditing) {
      updateLink(editingLink.id, {
        title: linkTitle,
        url: formattedUrl,
        description: description.trim(),
        categoryId,
        tags,
      });
    } else {
      addLink({
        title: linkTitle,
        url: formattedUrl,
        description: description.trim(),
        categoryId,
        tags,
      });
    }

    handleClose();
  };

  const previewDomain = url ? extractDomain(url) : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-2xl craft-panel hairline-sheen border border-slate-200 dark:border-white/[0.1] shadow-elevated dark:shadow-elevated-dark p-6 sm:p-7 z-10 my-auto bg-white dark:bg-[#0f121a]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/[0.07] mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300">
                {url ? (
                  <FaviconImage url={url} title={title} className="w-5 h-5" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                  {isEditing ? 'Edit Bookmark Node' : 'New Bookmark Node'}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {previewDomain ? previewDomain : 'Save web resource to client directory'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* URL Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Resource URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0c0e15] border ${
                  urlError
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-white/[0.08]'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50`}
                autoFocus={!isEditing}
              />
              {urlError && <p className="text-[11px] text-rose-500 mt-1">{urlError}</p>}
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Title / Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js Documentation"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Knowledge Cluster
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#121622]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of why this resource is useful..."
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none font-sans"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag and press Enter"
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#0c0e15] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag Badges */}
              {tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06] text-[10px] font-mono"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-500 ml-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200/80 dark:border-white/[0.07] mt-5">
              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-500 dark:hover:text-white transition-colors shadow-sm"
              >
                {isEditing ? 'Save Changes' : 'Create Bookmark'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
