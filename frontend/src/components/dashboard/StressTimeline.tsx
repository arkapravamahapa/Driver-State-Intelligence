import React from 'react';
import { MOCK_STATE_TRANSITIONS } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { ArrowRight, Clock, Activity } from 'lucide-react';

export const StressTimeline: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-rose-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            STRESS EVOLUTION TIMELINE
          </h3>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          STINT TRANSITION PIPELINE
        </span>
      </div>

      {/* Visual Pipeline Banner: CALM -> CONCERNED -> STRESSED */}
      <div className="my-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3.5">
        <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">
          Observed Macro State Migration Path
        </div>
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-400">
            <span className="font-bold">CALM</span>
            <span className="text-[10px] text-slate-400">(Laps 1–12)</span>
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />

          <div className="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-xs text-amber-400">
            <span className="font-bold">CONCERNED</span>
            <span className="text-[10px] text-slate-400">(Laps 13–18)</span>
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />

          <div className="flex items-center gap-2 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 font-mono text-xs text-rose-400 shadow-sm shadow-rose-950">
            <span className="font-bold">STRESSED</span>
            <span className="text-[10px] text-slate-400">(Laps 19–21)</span>
          </div>
        </div>
      </div>

      {/* Detailed Lap Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_STATE_TRANSITIONS.slice(-4).map((item) => {
          return (
            <div
              key={item.lap}
              className={`flex flex-col justify-between rounded-lg border p-3 transition-all ${
                item.state === 'STRESSED'
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : item.state === 'CONCERNED'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white">LAP {item.lap}</span>
                <span className="text-slate-400">{item.lapTime}</span>
              </div>

              <div className="my-2">
                <StatusBadge state={item.state as any} size="sm" />
              </div>

              <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                {item.note}
              </p>

              <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                <span>Stress Index:</span>
                <span className="font-bold text-slate-300">{item.stressScore}/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
