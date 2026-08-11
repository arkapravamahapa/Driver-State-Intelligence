import React from 'react';
import { StressVsPerformanceChart } from '../components/dashboard/StressVsPerformanceChart';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { MOCK_STATE_TRANSITIONS } from '../data/mockData';
import { GitCommitVertical, AlertCircle, Info, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';

export const Correlation: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Driver State vs Race Performance Correlation
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Multi-variable telemetry analysis mapping driver speech stress state against lap pace degradation
        </p>
      </div>

      {/* Primary Recharts Visualization */}
      <StressVsPerformanceChart />

      {/* Correlation Summary & Event Highlights Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Correlation Summary Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
            <Sparkles className="h-4 w-4 text-rose-400" />
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              CORRELATION FINDINGS SUMMARY
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <strong className="text-white block font-mono text-[11px] mb-1">
                Laps 10–12 Baseline:
              </strong>
              Driver vocal pitch remained calm (stress score 20–24/100) while lap times were consistent at 1:22.4 – 1:22.5.
            </p>

            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <strong className="text-amber-400 block font-mono text-[11px] mb-1">
                Laps 13–18 Transition Phase:
              </strong>
              Driver state shifted from Calm to Concerned following initial traction reports. Lap times degraded by +0.8s alongside a stress index rise to 72.
            </p>

            <p className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <strong className="text-rose-400 block font-mono text-[11px] mb-1">
                Laps 19–21 High Elevation:
              </strong>
              Stress score reached 87/100 after driver reported severe rear grip loss through Turn 7. Lap time degraded by +1.8s vs lap 18 baseline.
            </p>
          </div>

          {/* Mandatory Non-Causal Disclaimer */}
          <div className="mt-4 pt-2">
            <DisclaimerBanner />
          </div>
        </div>

        {/* Key Timeline Events List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <GitCommitVertical className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                KEY TELEMETRY CORRELATION EVENTS
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-400">STINT LOG</span>
          </div>

          <div className="space-y-3">
            {MOCK_STATE_TRANSITIONS.map((evt) => (
              <div
                key={evt.lap}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950 p-3 font-mono text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">LAP {evt.lap}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        evt.state === 'STRESSED'
                          ? 'bg-rose-500/20 text-rose-400'
                          : evt.state === 'CONCERNED'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {evt.state}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans text-slate-400 block mt-1">
                    {evt.note}
                  </span>
                </div>

                <div className="text-end shrink-0">
                  <span className="text-cyan-400 font-bold block">{evt.lapTime}</span>
                  <span className="text-[10px] text-slate-500">Score: {evt.stressScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
