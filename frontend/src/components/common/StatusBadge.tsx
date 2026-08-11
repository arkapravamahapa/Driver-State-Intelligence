import React from 'react';
import { DriverState, InsightPriority } from '../../types';

interface StatusBadgeProps {
  state?: DriverState;
  priority?: InsightPriority;
  risk?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  state,
  priority,
  risk,
  size = 'md',
  showDot = true,
}) => {
  let label = '';
  let colorClasses = '';
  let dotClass = '';

  if (state) {
    label = state;
    switch (state) {
      case 'CALM':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        dotClass = 'bg-emerald-400';
        break;
      case 'CONCERNED':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        dotClass = 'bg-amber-400';
        break;
      case 'STRESSED':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        dotClass = 'bg-rose-500 animate-pulse';
        break;
      case 'TIRED':
        colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        dotClass = 'bg-purple-400';
        break;
    }
  } else if (priority) {
    label = priority;
    switch (priority) {
      case 'HIGH':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        dotClass = 'bg-rose-500';
        break;
      case 'MEDIUM':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        dotClass = 'bg-amber-400';
        break;
      case 'LOW':
        colorClasses = 'bg-slate-500/10 text-slate-300 border-slate-500/30';
        dotClass = 'bg-slate-400';
        break;
    }
  } else if (risk) {
    label = `${risk} RISK`;
    switch (risk) {
      case 'LOW':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        dotClass = 'bg-emerald-400';
        break;
      case 'MODERATE':
        colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        dotClass = 'bg-blue-400';
        break;
      case 'ELEVATED':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        dotClass = 'bg-amber-400 animate-pulse';
        break;
      case 'HIGH':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        dotClass = 'bg-rose-500 animate-pulse';
        break;
    }
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3 py-1.5 tracking-wide font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-mono uppercase transition-colors ${sizeClasses} ${colorClasses}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      )}
      {label}
    </span>
  );
};
