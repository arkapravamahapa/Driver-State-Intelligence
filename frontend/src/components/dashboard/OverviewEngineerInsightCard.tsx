import React from 'react';
import { EngineerInsight } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface OverviewEngineerInsightCardProps {
  insight: EngineerInsight;
  onAcknowledge?: () => void;
  onNavigateToInsights?: () => void;
}

export const OverviewEngineerInsightCard: React.FC<OverviewEngineerInsightCardProps> = ({
  insight,
  onAcknowledge,
  onNavigateToInsights,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
      {/* Top Banner */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
                  ENGINEER DECISION ALERT
                </span>
                <StatusBadge priority={insight.priority} size="sm" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                LAP {insight.lapNumber} • {insight.timestamp}
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToInsights}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer"
          >
            <span>View All Insights</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Summary Header */}
        <div className="mt-3">
          <h4 className="font-sans text-base font-bold text-white">
            {insight.title}
          </h4>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {insight.summary}
          </p>
        </div>

        {/* Primary Concern Highlight */}
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block">
            Primary Concern:
          </span>
          <span className="text-xs font-bold text-amber-200">
            {insight.primaryConcern}
          </span>
        </div>

        {/* Evidence List */}
        <div className="mt-3 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
            Telemetry & Audio Evidence:
          </span>
          {insight.evidence.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-rose-400 font-bold">•</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Pit Action & Acknowledge */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {insight.actionSuggested && (
          <div className="text-xs text-slate-300">
            <span className="font-mono text-[10px] text-emerald-400 uppercase block font-semibold">
              Suggested Strategy Action:
            </span>
            <span className="text-slate-200">{insight.actionSuggested}</span>
          </div>
        )}

        <button
          onClick={onAcknowledge}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer shrink-0"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>ACKNOWLEDGE ALERT</span>
        </button>
      </div>
    </div>
  );
};
