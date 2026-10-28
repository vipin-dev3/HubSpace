import React from 'react';
import {
  Layers,
  Link2,
  MousePointerClick,
} from 'lucide-react';
import { useLinks } from '../../context/LinksContext';

export default function StatsOverview() {
  const { links, categories } = useLinks();

  const totalClicks = React.useMemo(() => {
    return links.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  }, [links]);

  return (
    <div className="mb-6 craft-panel rounded-2xl p-3 sm:p-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Metric 1: Total Links */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Nodes
            </p>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {links.length}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-7 bg-slate-200/80 dark:bg-white/[0.08]" />

        {/* Metric 2: Categories */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Categories
            </p>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-7 bg-slate-200/80 dark:bg-white/[0.08]" />

        {/* Metric 3: Launches Telemetry */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-slate-700 dark:text-slate-300">
            <MousePointerClick className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Telemetry Launches
            </p>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalClicks}
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-px h-7 bg-slate-200/80 dark:bg-white/[0.08]" />

        {/* Status Chip / Vault Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Vault Sync: Operational</span>
        </div>
      </div>
    </div>
  );
}
