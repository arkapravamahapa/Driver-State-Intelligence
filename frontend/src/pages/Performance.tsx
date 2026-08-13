import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_LAP_TELEMETRY } from '../data/mockData';
import { LapTelemetry, DriverProfile } from '../types';
import { fetchTelemetry } from '../api/telemetry';
import { MetricCard } from '../components/common/MetricCard';
import { Gauge, Clock, TrendingUp, Zap, Flag, Activity } from 'lucide-react';

type TelemetryStatus = 'loading' | 'success' | 'error';

interface PerformanceProps {
  driver: DriverProfile;
}

export const Performance: React.FC<PerformanceProps> = ({ driver }) => {
  // ---- Lap telemetry now comes from GET /api/telemetry instead of MOCK_LAP_TELEMETRY.
  // mockData.ts is kept as-is (untouched) and used below as a manual offline
  // fallback if the API call fails.
  const [telemetry, setTelemetry] = useState<LapTelemetry[]>([]);
  const [telemetryStatus, setTelemetryStatus] = useState<TelemetryStatus>('loading');
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  // MOCK_LAP_TELEMETRY has no driverId field (it's a single generic stint,
  // not per-driver), so it can't be filtered by the selected driver without
  // inventing an id. Track when we're in demo mode so it's shown unfiltered,
  // while live API data (which does carry driverId) is scoped to the driver.
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTelemetry = async () => {
      setTelemetryStatus('loading');
      setTelemetryError(null);
      try {
        const data = await fetchTelemetry();
        if (cancelled) return;
        setTelemetry(data);
        setIsDemoMode(false);
        setTelemetryStatus('success');
      } catch (err) {
        if (cancelled) return;
        setTelemetryError(err instanceof Error ? err.message : 'Failed to load telemetry data.');
        setTelemetryStatus('error');
      }
    };

    loadTelemetry();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    setTelemetryStatus('loading');
    setTelemetryError(null);
    fetchTelemetry()
      .then((data) => {
        setTelemetry(data);
        setIsDemoMode(false);
        setTelemetryStatus('success');
      })
      .catch((err) => {
        setTelemetryError(err instanceof Error ? err.message : 'Failed to load telemetry data.');
        setTelemetryStatus('error');
      });
  };

  const handleUseDemoData = () => {
    setTelemetry(MOCK_LAP_TELEMETRY);
    setIsDemoMode(true);
    setTelemetryStatus('success');
    setTelemetryError(null);
  };

  // Live API telemetry carries driverId, so scope it to the selected driver.
  // Offline demo data has no driverId to filter on, so it's shown as-is.
  const driverTelemetry = isDemoMode ? telemetry : telemetry.filter((item) => item.driverId === driver.id);

  // ---- Loading state ----
  if (telemetryStatus === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Loading Telemetry Data…
          </p>
        </div>
      </div>
    );
  }

  // ---- Error state (fetch failed) or empty state (no telemetry for this driver) ----
  if (telemetryStatus === 'error' || driverTelemetry.length === 0) {
    const isEmpty = telemetryStatus === 'success' && driverTelemetry.length === 0;

    return (
      <div className="flex h-64 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-slate-900/90 p-6 text-center shadow-lg">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-rose-400">
            {isEmpty ? 'No Telemetry Data Available' : 'Unable to Load Telemetry Data'}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {isEmpty
              ? `No telemetry data available for ${driver.name}.`
              : (telemetryError ?? 'The request to the backend API failed.')}
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

  // ---- Ready state (existing UI, unchanged, now sourced from telemetry state) ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Race Lap Telemetry & Performance
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Lap times, sector deltas, speed trap telemetry, and tyre degradation analysis
        </p>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Current Lap Time"
          value="1:24.6"
          subValue="+1.8s vs lap 18"
          icon={Clock}
          trend="up"
          trendText="Thermal Degradation"
          statusColor="rose"
          accentBorder
        />

        <MetricCard
          title="Best Stint Lap"
          value="1:22.2"
          subValue="LAP 8 • MEDIUM"
          icon={Flag}
          statusColor="emerald"
        />

        <MetricCard
          title="Average Stint Pace"
          value="1:23.8"
          subValue="21 Laps Completed"
          icon={Gauge}
          statusColor="blue"
        />

        <MetricCard
          title="Recent Degradation"
          value="+1.8s"
          subValue="Laps 18–21"
          icon={TrendingUp}
          trend="up"
          statusColor="amber"
        />
      </div>

      {/* Main Lap Pace Recharts Line Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                STINT LAP PACE CURVE
              </h3>
              <span className="text-[10px] text-slate-400">
                Pace trajectory across Laps 8–21 (Medium Compound)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/30">
              BEST: 1:22.2
            </span>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 text-rose-400 border border-rose-500/30">
              LAST: 1:26.4
            </span>
          </div>
        </div>

        <div className="my-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driverTelemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="lapNumber" stroke="#64748b" fontSize={11} fontFamily="monospace" tickFormatter={(v) => `L${v}`} />
              <YAxis domain={[81, 88]} stroke="#64748b" fontSize={11} fontFamily="monospace" tickFormatter={(v) => `${v}s`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs shadow-xl">
                        <div className="font-bold text-white mb-1">LAP {data.lapNumber}</div>
                        <div className="text-cyan-400">Time: {data.lapTimeFormatted}</div>
                        <div className="text-slate-400">S1: {data.sector1}s | S2: {data.sector2}s | S3: {data.sector3}s</div>
                        <div className="text-amber-400 mt-1">Tyre Temp: {data.rearTyreTempC}°C</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="lapTimeSeconds"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a' }}
                activeDot={{ r: 6, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Breakdown Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            SECTOR-BY-SECTOR TELEMETRY BREAKDOWN
          </h3>
          <span className="font-mono text-xs text-slate-400">SPA-FRANCORCHAMPS CIRCUIT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                <th className="pb-2">Lap</th>
                <th className="pb-2">Lap Time</th>
                <th className="pb-2">Sector 1</th>
                <th className="pb-2">Sector 2 (Grip Focus)</th>
                <th className="pb-2">Sector 3</th>
                <th className="pb-2">Max Speed</th>
                <th className="pb-2">Rear Tyre Temp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {driverTelemetry.slice(-8).map((lap) => (
                <tr key={lap.lapNumber} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 font-bold text-white">LAP {lap.lapNumber}</td>
                  <td className="py-2.5 font-bold text-cyan-400">{lap.lapTimeFormatted}</td>
                  <td className="py-2.5">{lap.sector1}s</td>
                  <td className={`py-2.5 font-semibold ${lap.sector2 >= 31.5 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {lap.sector2}s
                  </td>
                  <td className="py-2.5">{lap.sector3}s</td>
                  <td className="py-2.5">{lap.speedMaxKph} KPH</td>
                  <td className={`py-2.5 font-semibold ${lap.rearTyreTempC >= 125 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {lap.rearTyreTempC}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};