import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Star, Tag, Plus, Check } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';
import { formatUrl, isValidUrl, extractDomain } from '../../utils/urlHelper';
import FaviconImage from '../common/FaviconImage';

export default function AddEditLinkModal() {
  const { modalState, setModalState, categories, addLink, updateLink, allTags } = useLinks();
  const isOpen = modalState.addEditOpen;
  const editingLink = modalState.editingLink;
  const isEditing = Boolean(editingLink);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Populate or reset form whenever modal opens or editingLink changes
  useEffect(() => {
    if (isOpen) {
      if (editingLink) {
        setTitle(editingLink.title || '');
        setUrl(editingLink.url || '');
        setDescription(editingLink.description || '');
        setCategoryId(editingLink.categoryId || categories[0]?.id || 'development');
        setTags(editingLink.tags || []);
        setIsPinned(Boolean(editingLink.isPinned));
      } else {
        setTitle('');
        setUrl('');
        setDescription('');
        setCategoryId(modalState.preselectedCategory || categories[0]?.id || 'development');
        setTags([]);
        setIsPinned(false);
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

    // Auto-generate title from domain if left blank
    const linkTitle = title.trim() || extractDomain(formattedUrl);

    if (isEditing) {
      updateLink(editingLink.id, {
        title: linkTitle,
        url: formattedUrl,
        description: description.trim(),
        categoryId,
        tags,
        isPinned,
      });
    } else {
      addLink({
        title: linkTitle,
        url: formattedUrl,
        description: description.trim(),
        categoryId,
        tags,
        isPinned,
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                {url ? (
                  <FaviconImage url={url} title={title} className="w-5 h-5" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Bookmark' : 'Add New Link'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {previewDomain ? `Previewing: ${previewDomain}` : 'Save a web resource to your directory'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Destination URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="https://example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#181e2e] border ${
                  urlError
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-white/10'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40`}
                autoFocus={!isEditing}
              />
              {urlError && <p className="text-xs text-rose-500 mt-1">{urlError}</p>}
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Title / Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js Documentation"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#181e2e] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#181e2e] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of why this resource is useful..."
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-[#181e2e] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag and press Enter"
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#181e2e] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag Badges */}
              {tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-500 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite / Pin Checkbox */}
            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              />
              <label
                htmlFor="isPinned"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span>Pin to Quick Dock (Top Favorites)</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200/80 dark:border-white/10 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isEditing ? 'Save Changes' : 'Add Bookmark'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

