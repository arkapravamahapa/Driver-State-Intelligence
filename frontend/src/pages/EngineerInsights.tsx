import React, { useState, useEffect } from 'react';
import { MOCK_ENGINEER_INSIGHTS } from '../data/mockData';
import { EngineerInsight, InsightCategory } from '../types';
import { fetchInsights } from '../api/insights';
import { StatusBadge } from '../components/common/StatusBadge';
import { Lightbulb, AlertTriangle, Filter, CheckCircle2, Radio, ArrowRight } from 'lucide-react';

type InsightsStatus = 'loading' | 'success' | 'error';

export const EngineerInsights: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  // ---- Insights now come from GET /api/insights instead of MOCK_ENGINEER_INSIGHTS.
  // mockData.ts is kept as-is (untouched) and used below as a manual offline
  // fallback if the API call fails.
  const [insights, setInsights] = useState<EngineerInsight[]>([]);
  const [insightsStatus, setInsightsStatus] = useState<InsightsStatus>('loading');
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInsights = async () => {
      setInsightsStatus('loading');
      setInsightsError(null);
      try {
        const data = await fetchInsights();
        if (cancelled) return;
        setInsights(data);
        setInsightsStatus('success');
      } catch (err) {
        if (cancelled) return;
        setInsightsError(err instanceof Error ? err.message : 'Failed to load engineer insights.');
        setInsightsStatus('error');
      }
    };

    loadInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    setInsightsStatus('loading');
    setInsightsError(null);
    fetchInsights()
      .then((data) => {
        setInsights(data);
        setInsightsStatus('success');
      })
      .catch((err) => {
        setInsightsError(err instanceof Error ? err.message : 'Failed to load engineer insights.');
        setInsightsStatus('error');
      });
  };

  const handleUseDemoData = () => {
    setInsights(MOCK_ENGINEER_INSIGHTS);
    setInsightsStatus('success');
    setInsightsError(null);
  };

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

  // ---- Loading state ----
  if (insightsStatus === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Loading Engineer Insights…
          </p>
        </div>
      </div>
    );
  }

  // ---- Error state (fetch failed) or empty state (API returned zero insights) ----
  if (insightsStatus === 'error' || insights.length === 0) {
    const isEmpty = insightsStatus === 'success' && insights.length === 0;

    return (
      <div className="flex h-64 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-slate-900/90 p-6 text-center shadow-lg">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-rose-400">
            {isEmpty ? 'No Engineer Insights Available' : 'Unable to Load Engineer Insights'}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {isEmpty
              ? 'The API returned an empty insights list for this session.'
              : (insightsError ?? 'The request to the backend API failed.')}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={handleRetry}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={handleUseDemoData}
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 cursor-pointer"
            >
              Use Offline Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              {(insight.evidence ?? []).map((bullet, idx) => (
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