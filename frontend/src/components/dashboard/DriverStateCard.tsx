import React from 'react';
import { DriverProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface DriverStateCardProps {
  driver: DriverProfile;
}

export const DriverStateCard: React.FC<DriverStateCardProps> = ({ driver }) => {
  const { stateDistribution } = driver;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-rose-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            DRIVER EMOTIONAL STATE
          </h3>
        </div>
        <StatusBadge state={driver.currentState} size="sm" />
      </div>

      {/* Main State Score Block */}
      <div className="my-4 flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Current Primary Classification
          </span>
          <div className="font-mono text-2xl font-bold tracking-tight text-rose-400">
            {driver.currentState}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
            <span>Trend: <strong className="text-white">{driver.stateTrend}</strong></span>
          </div>
        </div>

        {/* Confidence Ring / Meter */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-rose-500/30 bg-rose-500/10 font-mono text-lg font-bold text-rose-400 shadow-inner">
            {driver.stateConfidence}%
          </div>
          <span className="mt-1 font-mono text-[9px] uppercase text-slate-500">
            AI Confidence
          </span>
        </div>
      </div>

      {/* Compact Distribution Bars */}
      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
          <span>Stint State Distribution</span>
          <span>Lap 1–21 Cumulative</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Stressed */}
          <div>
            <div className="flex justify-between font-mono text-[11px] mb-1">
              <span className="text-rose-400 font-semibold">STRESSED</span>
              <span className="text-slate-300">{stateDistribution.stressed}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                style={{ width: `${stateDistribution.stressed}%` }}
              />
            </div>
          </div>

          {/* Concerned */}
          <div>
            <div className="flex justify-between font-mono text-[11px] mb-1">
              <span className="text-amber-400 font-semibold">CONCERNED</span>
              <span className="text-slate-300">{stateDistribution.concerned}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${stateDistribution.concerned}%` }}
              />
            </div>
          </div>

          {/* Calm */}
          <div>
            <div className="flex justify-between font-mono text-[11px] mb-1">
              <span className="text-emerald-400 font-semibold">CALM</span>
              <span className="text-slate-300">{stateDistribution.calm}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${stateDistribution.calm}%` }}
              />
            </div>
          </div>

          {/* Tired */}
          <div>
            <div className="flex justify-between font-mono text-[11px] mb-1">
              <span className="text-purple-400 font-semibold">TIRED</span>
              <span className="text-slate-300">{stateDistribution.tired}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${stateDistribution.tired}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
