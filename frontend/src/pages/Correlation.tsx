import React, { useState, useEffect } from 'react';
import { StressVsPerformanceChart } from '../components/dashboard/StressVsPerformanceChart';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { MOCK_STATE_TRANSITIONS } from '../data/mockData';
import { DriverProfile } from '../types';
import { fetchCorrelation, CorrelationLap } from '../api/correlation';
import { GitCommitVertical, AlertCircle, Info, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';

type CorrelationStatus = 'loading' | 'success' | 'error';

// The existing "Key Telemetry Correlation Events" list is shaped as
// { lap, state, stressScore, lapTime, note } (matching MOCK_STATE_TRANSITIONS).
// The live API returns a different shape (lapNumber, driverState, lapTimeSeconds,
// radioTranscript, ...), so this local type + adapter translate one into the
// other WITHOUT changing the existing JSX below or any shared types.
interface CorrelationEvent {
  lap: number;
  state: string;
  stressScore: number;
  lapTime: string;
  note: string;
}

/** Formats seconds (e.g. 84.2) as "M:SS.s" (e.g. "1:24.2") — a straightforward
 * derivation from lapTimeSeconds, which the API does provide; lapTimeFormatted
 * itself is NOT provided by /api/correlation, so it's derived here rather than
 * invented or left blank. */
const formatLapTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1).padStart(4, '0');
  return `${minutes}:${secs}`;
};

const toCorrelationEvent = (row: CorrelationLap): CorrelationEvent => ({
  lap: row.lapNumber,
  state: row.driverState,
  stressScore: row.stressScore,
  lapTime: formatLapTime(row.lapTimeSeconds),
  note: row.radioTranscript ?? 'No radio transmission logged for this lap.'
});

interface CorrelationProps {
  driver: DriverProfile;
}

export const Correlation: React.FC<CorrelationProps> = ({ driver }) => {
  // ---- Key Telemetry Correlation Events now come from GET /api/correlation/:driverId
  // instead of MOCK_STATE_TRANSITIONS. mockData.ts is kept as-is (untouched) and
  // used below as a manual offline fallback if the API call fails. The chart above
  // (StressVsPerformanceChart) is a shared component that still uses its own
  // internal mock data — it is intentionally left untouched (see report).
  const [events, setEvents] = useState<CorrelationEvent[]>([]);
  const [status, setStatus] = useState<CorrelationStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCorrelation = async () => {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchCorrelation(driver.id);
        if (cancelled) return;
        setEvents(data.map(toCorrelationEvent));
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load correlation data.');
        setStatus('error');
      }
    };

    loadCorrelation();
    return () => {
      cancelled = true;
    };
  }, [driver.id]);

  const handleRetry = () => {
    setStatus('loading');
    setError(null);
    fetchCorrelation(driver.id)
      .then((data) => {
        setEvents(data.map(toCorrelationEvent));
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load correlation data.');
        setStatus('error');
      });
  };

  const handleUseDemoData = () => {
    setEvents(MOCK_STATE_TRANSITIONS);
    setStatus('success');
    setError(null);
  };

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
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Loading Correlation Events…
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-lg border border-rose-500/30 bg-slate-950 p-4 text-center">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                  Unable to Load Correlation Events
                </p>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  {error ?? 'The request to the backend API failed.'}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    onClick={handleRetry}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-[11px] font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleUseDemoData}
                    className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-rose-400 transition hover:bg-rose-500/20 cursor-pointer"
                  >
                    Use Offline Demo Data
                  </button>
                </div>
              </div>
            )}

            {status === 'success' && events.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="font-mono text-xs text-slate-400">No correlation events available for this session.</p>
                <button
                  onClick={handleUseDemoData}
                  className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-rose-400 transition hover:bg-rose-500/20 cursor-pointer"
                >
                  Use Offline Demo Data
                </button>
              </div>
            )}

            {status === 'success' && events.map((evt) => (
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