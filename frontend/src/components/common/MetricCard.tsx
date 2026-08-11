import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  statusColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'slate';
  accentBorder?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  badge,
  trend,
  trendText,
  statusColor = 'slate',
  accentBorder = false,
}) => {
  const borderColors = {
    emerald: 'border-l-4 border-l-emerald-500',
    amber: 'border-l-4 border-l-amber-500',
    rose: 'border-l-4 border-l-rose-500',
    blue: 'border-l-4 border-l-blue-500',
    purple: 'border-l-4 border-l-purple-500',
    slate: 'border-slate-800',
  }[statusColor];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700 ${
        accentBorder ? borderColors : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge}
          {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="font-mono text-2xl font-bold tracking-tight text-white">
          {value}
        </div>

        {subValue && (
          <span className="font-mono text-xs text-slate-400">{subValue}</span>
        )}
      </div>

      {trendText && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
          {trend === 'up' && <span className="text-rose-400">↑</span>}
          {trend === 'down' && <span className="text-emerald-400">↓</span>}
          <span className="text-slate-400">{trendText}</span>
        </div>
      )}
    </div>
  );
};
