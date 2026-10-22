import React from 'react';
import { Bookmark, Star, FolderGit2, MousePointerClick, Sparkles } from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function StatsOverview() {
  const { links, categories, pinnedLinks } = useLinks();

  const totalClicks = React.useMemo(() => {
    return links.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  }, [links]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Links
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {links.length}
          </p>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 fill-amber-500/20" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pinned
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {pinnedLinks.length}
          </p>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Categories
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {categories.length}
          </p>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <MousePointerClick className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Launches
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {totalClicks}
          </p>
        </div>
      </div>
    </div>
  );
}

