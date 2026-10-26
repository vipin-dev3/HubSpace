import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { INITIAL_CATEGORIES, INITIAL_LINKS } from '../data/linksData';

const LinksContext = createContext();

const CURRENT_DATA_VERSION = 'v7_persistent_launches';

function syncStorageWithInitialData() {
  try {
    const savedVersion = localStorage.getItem('hubspace_data_version');
    const savedLinksRaw = localStorage.getItem('hubspace_links');
    const savedCategoriesRaw = localStorage.getItem('hubspace_categories');

    // Fresh initialization if no links are stored
    if (!savedLinksRaw) {
      localStorage.setItem('hubspace_data_version', CURRENT_DATA_VERSION);
      localStorage.setItem('hubspace_categories', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem('hubspace_links', JSON.stringify(INITIAL_LINKS));
      return {
        categories: INITIAL_CATEGORIES,
        links: INITIAL_LINKS,
      };
    }

    const parsedLinks = JSON.parse(savedLinksRaw);
    const parsedCategories = savedCategoriesRaw ? JSON.parse(savedCategoriesRaw) : INITIAL_CATEGORIES;

    // Check if legacy ChatGPT or Claude links are present
    const hasLegacy = Array.isArray(parsedLinks) && parsedLinks.some(
      (l) => l.url?.includes('chatgpt.com') || l.url?.includes('claude.ai')
    );

    // If already on latest version, valid array, and no legacy links, return stored data as-is
    if (savedVersion === CURRENT_DATA_VERSION && Array.isArray(parsedLinks) && !hasLegacy) {
      return {
        categories: parsedCategories,
        links: parsedLinks,
      };
    }

    // Version migration or legacy cleanup: preserve user clicks and custom links
    const clickMap = new Map();
    if (Array.isArray(parsedLinks)) {
      parsedLinks.forEach((l) => {
        if (l.id && typeof l.clickCount === 'number') {
          clickMap.set(l.id, l.clickCount);
        }
        if (l.url && typeof l.clickCount === 'number') {
          clickMap.set(l.url.trim().toLowerCase(), l.clickCount);
        }
      });
    }

    // Rehydrate INITIAL_LINKS with any previously recorded clicks
    const mergedLinks = INITIAL_LINKS.map((seedLink) => {
      const existingClicks = clickMap.get(seedLink.id) ?? clickMap.get(seedLink.url.trim().toLowerCase()) ?? 0;
      return {
        ...seedLink,
        clickCount: existingClicks,
      };
    });

    // Keep any user-added custom links (not in INITIAL_LINKS and not legacy)
    const seedIds = new Set(INITIAL_LINKS.map((l) => l.id));
    const seedUrls = new Set(INITIAL_LINKS.map((l) => l.url.trim().toLowerCase()));
    const customLinks = Array.isArray(parsedLinks)
      ? parsedLinks.filter(
          (l) =>
            !seedIds.has(l.id) &&
            !seedUrls.has(l.url?.trim().toLowerCase()) &&
            !l.url?.includes('chatgpt.com') &&
            !l.url?.includes('claude.ai')
        )
      : [];

    const finalLinks = [...mergedLinks, ...customLinks];

    localStorage.setItem('hubspace_data_version', CURRENT_DATA_VERSION);
    localStorage.setItem('hubspace_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('hubspace_links', JSON.stringify(finalLinks));

    return {
      categories: INITIAL_CATEGORIES,
      links: finalLinks,
    };
  } catch (err) {
    console.error('Error synchronizing storage:', err);
    return {
      categories: INITIAL_CATEGORIES,
      links: INITIAL_LINKS,
    };
  }
}

export function LinksProvider({ children }) {
  // --- Persistent State ---
  const [categories, setCategories] = useState(() => syncStorageWithInitialData().categories);
  const [links, setLinks] = useState(() => syncStorageWithInitialData().links);

  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('hubspace_view_mode') || 'detailed';
    } catch {
      return 'detailed';
    }
  });

  // Category collapsed state mapping: { [categoryId]: boolean }
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // --- Filtering & Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'favorites', or categoryId
  const [selectedTag, setSelectedTag] = useState(null);

  // --- Modals State ---
  const [modalState, setModalState] = useState({
    addEditOpen: false,
    editingLink: null, // null for new link or link object
    preselectedCategory: null,
    importExportOpen: false,
    deleteConfirm: null, // null or link object to delete
  });

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- LocalStorage Synchronization ---
  useEffect(() => {
    try {
      localStorage.setItem('hubspace_categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('hubspace_links', JSON.stringify(links));
    } catch (e) {
      console.error('Failed to save links to localStorage:', e);
    }
  }, [links]);

  useEffect(() => {
    try {
      localStorage.setItem('hubspace_view_mode', viewMode);
    } catch (e) {
      console.error('Failed to save view mode to localStorage:', e);
    }
  }, [viewMode]);

  // --- Link Actions ---
  const addLink = (newLinkData) => {
    const newLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newLinkData.title.trim(),
      url: newLinkData.url.trim(),
      description: newLinkData.description?.trim() || '',
      categoryId: newLinkData.categoryId || (categories[0]?.id || 'ai-tools'),
      tags: Array.isArray(newLinkData.tags) ? newLinkData.tags : [],
      isPinned: Boolean(newLinkData.isPinned),
      clickCount: 0,
      createdAt: new Date().toISOString(),
    };

    setLinks((prev) => [newLink, ...prev]);
    addToast(`"${newLink.title}" added to bookmarks!`, 'success');
    return newLink;
  };

  const updateLink = (id, updatedFields) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updatedFields, updatedAt: new Date().toISOString() } : link))
    );
    addToast('Bookmark updated successfully', 'success');
  };

  const deleteLink = (id) => {
    const target = links.find((l) => l.id === id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
    if (target) {
      addToast(`"${target.title}" removed`, 'info');
    }
  };

  const togglePin = (id) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === id) {
          const newState = !link.isPinned;
          addToast(newState ? `Pinned "${link.title}" to Top Dock` : `Unpinned "${link.title}"`, 'info');
          return { ...link, isPinned: newState };
        }
        return link;
      })
    );
  };

  const incrementClick = (id) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, clickCount: (link.clickCount || 0) + 1 } : link))
    );
  };

  // --- Category Actions ---
  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const setAllCategoriesCollapse = (shouldCollapse) => {
    const next = {};
    categories.forEach((c) => {
      next[c.id] = shouldCollapse;
    });
    setCollapsedCategories(next);
  };

  // --- Import / Export / Reset ---
  const exportBookmarks = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      generator: 'HubSpace Bookmark Directory',
      categories,
      links,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `hubspace-bookmarks-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Bookmarks exported to JSON', 'success');
  };

  const importBookmarks = (jsonData, mode = 'merge') => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      if (!data.links || !Array.isArray(data.links)) {
        throw new Error('Invalid JSON format: missing "links" array.');
      }

      if (mode === 'replace') {
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        setLinks(data.links);
        addToast(`Replaced current directory with ${data.links.length} bookmarks`, 'success');
      } else {
        // Merge mode: Add missing categories, combine links by URL or ID
        if (data.categories && Array.isArray(data.categories)) {
          setCategories((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newCats = data.categories.filter((c) => !existingIds.has(c.id));
            return [...prev, ...newCats];
          });
        }

        setLinks((prev) => {
          const existingUrls = new Set(prev.map((l) => l.url.toLowerCase()));
          const newLinks = data.links.filter((l) => !existingUrls.has(l.url?.toLowerCase()));
          return [...prev, ...newLinks];
        });

        addToast(`Merged ${data.links.length} bookmarks into HubSpace`, 'success');
      }
      return true;
    } catch (err) {
      addToast(`Import failed: ${err.message}`, 'error');
      return false;
    }
  };

  const resetToDefaultData = () => {
    localStorage.setItem('hubspace_data_version', CURRENT_DATA_VERSION);
    localStorage.setItem('hubspace_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('hubspace_links', JSON.stringify(INITIAL_LINKS));
    setCategories(INITIAL_CATEGORIES);
    setLinks(INITIAL_LINKS);
    setSelectedCategory('all');
    setSelectedTag(null);
    setSearchQuery('');
    setCollapsedCategories({});
    addToast('Reset to default bookmarks and categories', 'info');
  };

  // --- Category Map for Fast Lookup ---
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = cat;
    });
    return map;
  }, [categories]);

  // --- Enriched Links with Category Name for Fuzzy Search ---
  const enrichedLinks = useMemo(() => {
    return links.map((link) => ({
      ...link,
      categoryName: categoryMap[link.categoryId]?.name || '',
    }));
  }, [links, categoryMap]);

  // --- Fuse.js Instance ---
  const fuse = useMemo(() => {
    return new Fuse(enrichedLinks, {
      keys: [
        { name: 'title', weight: 0.35 },
        { name: 'description', weight: 0.25 },
        { name: 'tags', weight: 0.2 },
        { name: 'url', weight: 0.1 },
        { name: 'categoryName', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [enrichedLinks]);

  // --- Filtered Links ---
  const filteredLinks = useMemo(() => {
    let result = enrichedLinks;

    // 1. Enhanced Search Query Filter (Exact substring match + Fuse fuzzy search)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();

      // Priority 1: Exact matches in title, url, tags, description, category
      const exactMatches = enrichedLinks.filter((l) => {
        const inTitle = l.title?.toLowerCase().includes(q);
        const inUrl = l.url?.toLowerCase().includes(q);
        const inDesc = l.description?.toLowerCase().includes(q);
        const inTags = l.tags?.some((t) => t.toLowerCase().includes(q));
        const inCat = l.categoryName?.toLowerCase().includes(q);
        return inTitle || inUrl || inDesc || inTags || inCat;
      });

      // Priority 2: Fuzzy matches via Fuse
      const fuseResults = fuse.search(searchQuery.trim()).map((r) => r.item);

      // Merge preserving exact matches first, followed by unique fuzzy results
      const exactIds = new Set(exactMatches.map((l) => l.id));
      const additionalFuzzy = fuseResults.filter((l) => !exactIds.has(l.id));
      result = [...exactMatches, ...additionalFuzzy];
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((link) => link.categoryId === selectedCategory);
    }

    // 3. Tag Filter
    if (selectedTag) {
      result = result.filter((link) => link.tags?.includes(selectedTag));
    }

    return result;
  }, [enrichedLinks, searchQuery, fuse, selectedCategory, selectedTag]);

  // --- Pinned / Favorite Links (for Top Dock) ---
  const pinnedLinks = useMemo(() => {
    return links.filter((link) => link.isPinned);
  }, [links]);

  // --- Unique Tags across all links ---
  const allTags = useMemo(() => {
    const tagCount = {};
    links.forEach((link) => {
      if (Array.isArray(link.tags)) {
        link.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [links]);

  return (
    <LinksContext.Provider
      value={{
        categories,
        setCategories,
        links,
        filteredLinks,
        pinnedLinks,
        allTags,
        categoryMap,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedTag,
        setSelectedTag,
        collapsedCategories,
        toggleCategoryCollapse,
        setAllCategoriesCollapse,
        addLink,
        updateLink,
        deleteLink,
        togglePin,
        incrementClick,
        exportBookmarks,
        importBookmarks,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast,
        modalState,
        setModalState,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
}

