import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Activity, 
  Gauge, 
  GitCommitVertical, 
  Lightbulb, 
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'overview'
  | 'radio'
  | 'state'
  | 'performance'
  | 'correlation'
  | 'insights'
  | 'history';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  highPriorityCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
  highPriorityCount = 1,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'radio', label: 'Radio Analysis', icon: Radio },
    { id: 'state', label: 'Driver State', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Gauge },
    { id: 'correlation', label: 'Correlation', icon: GitCommitVertical },
    { id: 'insights', label: 'Engineer Insights', icon: Lightbulb, badge: highPriorityCount },
    { id: 'history', label: 'Session History', icon: History },
  ];

  return (
    <aside
      className={`relative flex flex-col h-full shrink-0 border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 overflow-y-auto ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Group */}
      <div className="flex-1 space-y-1 p-3">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            Pit-Wall Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-500/10 text-rose-400 font-semibold border-l-2 border-rose-500'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed hover */}
              {collapsed && (
                <div className="absolute left-full ml-2 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Toggle Button */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          title={collapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono">
              <ChevronLeft className="h-4 w-4" />
              <span>COLLAPSE SIDEBAR</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
