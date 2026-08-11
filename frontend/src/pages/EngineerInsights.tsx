import React, { useState } from 'react';
import { MOCK_ENGINEER_INSIGHTS } from '../data/mockData';
import { EngineerInsight, InsightCategory } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Lightbulb, AlertTriangle, Filter, CheckCircle2, Radio, ArrowRight } from 'lucide-react';

export const EngineerInsights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [insights, setInsights] = useState<EngineerInsight[]>(MOCK_ENGINEER_INSIGHTS);

  const categories: string[] = [
    'ALL',
    'Performance Risk',
    'Driver State',
    'Tyre Concern',
    'Communication Alert',
  ];

  const filteredInsights = insights.filter(
    (ins) => selectedCategory === 'ALL' || ins.category === selectedCategory
  );

  const toggleAcknowledge = (id: string) => {
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === id ? { ...ins, acknowledged: !ins.acknowledged } : ins
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Race Engineering Actionable Insights
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Automated decision support linking driver speech stress, acoustic pitch, and lap telemetry anomalies
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <span className="flex items-center gap-1 font-mono text-xs text-slate-400 mr-2">
          <Filter className="h-3.5 w-3.5" /> Filter Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-xl border p-5 transition-all backdrop-blur-md shadow-lg ${
              insight.priority === 'HIGH'
                ? 'border-rose-500/40 bg-slate-900/90'
                : insight.priority === 'MEDIUM'
                ? 'border-amber-500/30 bg-slate-900/90'
                : 'border-slate-800 bg-slate-900/90'
            } ${insight.acknowledged ? 'opacity-60' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <StatusBadge priority={insight.priority} size="sm" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  {insight.category}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                <span>LAP {insight.lapNumber}</span>
                <span>•</span>
                <span>{insight.timestamp}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-sans text-base font-bold text-white">
                {insight.title}
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {insight.summary}
              </p>
            </div>

            {/* Primary Concern Highlight */}
            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
              <span className="font-mono text-[10px] text-amber-400 font-semibold uppercase block">
                Primary Concern:
              </span>
              <span className="text-slate-200 font-semibold">{insight.primaryConcern}</span>
            </div>

            {/* Evidence Bullets */}
            <div className="mt-3 space-y-1.5 text-xs text-slate-300">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold block">
                Supporting Evidence Bullets:
              </span>
              {insight.evidence.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Suggested Pit-Wall Action */}
            {insight.actionSuggested && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-300">
                <span className="font-mono text-[10px] font-bold uppercase block text-emerald-400">
                  Recommended Race Strategy Action:
                </span>
                <span>{insight.actionSuggested}</span>
              </div>
            )}

            {/* Footer / Acknowledge Action */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Radio className="h-3.5 w-3.5 text-rose-400" />
                <span>Associated Radio: {insight.relatedRadioCallId || 'N/A'}</span>
              </div>

              <button
                onClick={() => toggleAcknowledge(insight.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition cursor-pointer ${
                  insight.acknowledged
                    ? 'border-slate-800 bg-slate-800 text-slate-400'
                    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{insight.acknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE INSIGHT'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
