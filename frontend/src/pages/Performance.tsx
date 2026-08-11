import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_LAP_TELEMETRY } from '../data/mockData';
import { MetricCard } from '../components/common/MetricCard';
import { Gauge, Clock, TrendingUp, Zap, Flag, Activity } from 'lucide-react';

export const Performance: React.FC = () => {
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
            <LineChart data={MOCK_LAP_TELEMETRY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              {MOCK_LAP_TELEMETRY.slice(-8).map((lap) => (
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
