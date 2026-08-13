import React, { useState, useEffect } from 'react';
import { DriverProfile } from '../types';
import { MOCK_STATE_TRANSITIONS, MOCK_RADIO_CALLS } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { fetchDriverState } from '../api/state';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Cpu, 
  BarChart2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface DriverStateProps {
  driver: DriverProfile;
}

type DriverStateStatus = 'loading' | 'success' | 'error';

export const DriverState: React.FC<DriverStateProps> = ({ driver }) => {
  // ---- Current state now comes from GET /api/state/:driverId instead of
  // relying solely on driver.currentState. NOTE: the backend endpoint only
  // derives `currentState` (from the driver's latest radio call) — it does
  // not provide confidence, trend, or a distribution breakdown, so those
  // continue to come from the `driver` prop exactly as before.
  const [apiCurrentState, setApiCurrentState] = useState<DriverProfile['currentState'] | null>(null);
  const [stateStatus, setStateStatus] = useState<DriverStateStatus>('loading');
  const [stateError, setStateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadState = async () => {
      setStateStatus('loading');
      setStateError(null);
      try {
        const data = await fetchDriverState(driver.id);
        if (cancelled) return;
        setApiCurrentState(data.currentState);
        setStateStatus('success');
      } catch (err) {
        if (cancelled) return;
        setStateError(err instanceof Error ? err.message : 'Failed to load driver state.');
        setStateStatus('error');
      }
    };

    loadState();
    return () => {
      cancelled = true;
    };
  }, [driver.id]);

  const handleRetry = () => {
    setStateStatus('loading');
    setStateError(null);
    fetchDriverState(driver.id)
      .then((data) => {
        setApiCurrentState(data.currentState);
        setStateStatus('success');
      })
      .catch((err) => {
        setStateError(err instanceof Error ? err.message : 'Failed to load driver state.');
        setStateStatus('error');
      });
  };

  const handleUseDemoData = () => {
    // Falls back to this driver's own mock-derived state (already on the `driver` prop).
    setApiCurrentState(driver.currentState);
    setStateStatus('success');
    setStateError(null);
  };

  // ---- Loading state ----
  if (stateStatus === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-rose-500" />
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Loading Driver State…
          </p>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (stateStatus === 'error') {
    return (
      <div className="flex h-64 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-slate-900/90 p-6 text-center shadow-lg">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-rose-400">
            Unable to Load Driver State
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {stateError ?? 'The request to the backend API failed.'}
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

  // ---- Ready state (existing UI, unchanged; Primary Classification now sourced from API state) ----
  const currentState = apiCurrentState ?? driver.currentState;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Driver Psychophysiological State Analytics
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Acoustic stress indices, mental fatigue indicators, and stint emotional state tracking
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Primary Classification"
          value={currentState}
          subValue={`${driver.stateConfidence}% CONF`}
          icon={Activity}
          badge={<StatusBadge state={currentState} size="sm" />}
          statusColor="rose"
          accentBorder
        />

        <MetricCard
          title="Stress Index Trend"
          value={driver.stateTrend}
          subValue="+24% over 3 laps"
          icon={TrendingUp}
          trend="up"
          statusColor="amber"
        />

        <MetricCard
          title="Calm Stint Ratio"
          value="12%"
          subValue="Laps 1–12"
          icon={CheckCircle2}
          statusColor="emerald"
        />

        <MetricCard
          title="Stressed Duration"
          value="3 Laps"
          subValue="Laps 19–21"
          icon={ShieldAlert}
          statusColor="rose"
        />
      </div>

      {/* Grid: Stint State Migration + Distribution Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left (2 cols): Visual Macro State Migration Path */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-400" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                DRIVER EMOTIONAL STATE TRANSITION PIPELINE
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-400">RACE SESSION 01</span>
          </div>

          <div className="my-6 space-y-4">
            {/* Step 1: CALM */}
            <div className="flex items-center gap-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 font-mono font-bold text-emerald-400">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-bold text-emerald-400">CALM BASELINE</span>
                  <span className="text-slate-400">Laps 1 – 12</span>
                </div>
                <p className="text-xs text-slate-300">
                  Driver voice pitch nominal. Clear radio check, consistent lap times (1:22.2 – 1:22.5).
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-slate-600 rotate-90" />
            </div>

            {/* Step 2: CONCERNED */}
            <div className="flex items-center gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 font-mono font-bold text-amber-400">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-bold text-amber-400">CONCERNED STAGE</span>
                  <span className="text-slate-400">Laps 13 – 18</span>
                </div>
                <p className="text-xs text-slate-300">
                  First notes of traction degradation and rear balance rearward shift. Stress index 42 → 72.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-slate-600 rotate-90" />
            </div>

            {/* Step 3: STRESSED */}
            <div className="flex items-center gap-4 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 shadow-sm shadow-rose-950">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 font-mono font-bold text-rose-400">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-bold text-rose-400">STRESSED HIGH ELEVATION</span>
                  <span className="text-slate-400">Laps 19 – 21 (CURRENT)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Reported severe grip loss through Turn 7. Acoustic tension +28%. Lap time degraded by +1.8s.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Cumulative State Distribution Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              CUMULATIVE STINT DISTRIBUTION
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-rose-400 font-semibold">STRESSED</span>
                <span className="text-slate-200">62%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-amber-400 font-semibold">CONCERNED</span>
                <span className="text-slate-200">18%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-emerald-400 font-semibold">CALM</span>
                <span className="text-slate-200">12%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-purple-400 font-semibold">TIRED</span>
                <span className="text-slate-200">8%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400 font-mono">
            <span>Primary Stint Driver State:</span>
            <span className="text-rose-400 font-bold block mt-0.5">STRESSED / REAR-LIMITED</span>
          </div>
        </div>
      </div>

      {/* Recent State Changes Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            RECENT STATE TRANSITION EVENT LOG
          </h3>
          <span className="font-mono text-xs text-slate-400">8 RECORDED EVENTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="pb-2">Lap</th>
                <th className="pb-2">Detected State</th>
                <th className="pb-2">Stress Score</th>
                <th className="pb-2">Lap Time</th>
                <th className="pb-2">Engineer Context Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_STATE_TRANSITIONS.map((row) => (
                <tr key={row.lap} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 font-bold text-white">LAP {row.lap}</td>
                  <td className="py-2.5">
                    <StatusBadge state={row.state as any} size="sm" />
                  </td>
                  <td className="py-2.5 font-bold text-slate-200">{row.stressScore} / 100</td>
                  <td className="py-2.5 text-slate-300">{row.lapTime}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};