import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea
} from 'recharts';
import { MOCK_LAP_TELEMETRY } from '../../data/mockData';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { BarChart3, Info } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-950/95 p-3 font-mono text-xs shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 font-bold text-white">
          <span>LAP {data.lapNumber} TELEMETRY</span>
          <span className="text-emerald-400">{data.lapTimeFormatted}</span>
        </div>
        <div className="mt-2 space-y-1 text-slate-300">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Driver State:</span>
            <span
              className={`font-semibold ${
                data.driverState === 'STRESSED'
                  ? 'text-rose-400'
                  : data.driverState === 'CONCERNED'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {data.driverState}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Stress Score:</span>
            <span className="font-bold text-rose-400">{data.stressScore} / 100</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Lap Delta vs Best:</span>
            <span className="text-amber-400">+{data.deltaVsBest.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Rear Tyre Temp:</span>
            <span className="text-slate-200">{data.rearTyreTempC}°C</span>
          </div>
          {data.radioCallId && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-blue-400 italic">
              Radio Transmission Logged
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const StressVsPerformanceChart: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-rose-400" />
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              DRIVER STRESS VS LAP TIME TELEMETRY
            </h3>
            <p className="text-[10px] text-slate-400">
              Dual-Axis Telemetry: Lap Pace (Seconds) vs Audio Stress Score Index (0–100)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Lap Time (s)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Stress Score</span>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="my-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={MOCK_LAP_TELEMETRY}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="lapNumber"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={(val) => `L${val}`}
            />
            {/* Left Y Axis: Lap Time in seconds */}
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[81, 88]}
              stroke="#06b6d4"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={(val) => `${val}s`}
            />
            {/* Right Y Axis: Stress Score 0-100 */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke="#f43f5e"
              fontSize={11}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Stress State Zone Highlight (Laps 19-21) */}
            <ReferenceArea
              yAxisId="right"
              x1={19}
              x2={21}
              ifOverflow="extendDomain"
            />

            {/* Stress Score Bar Background */}
            <Bar
              yAxisId="right"
              dataKey="stressScore"
              name="Stress Score"
              fill="#f43f5e"
              opacity={0.35}
              radius={[4, 4, 0, 0]}
              barSize={16}
            />

            {/* Lap Time Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="lapTimeSeconds"
              name="Lap Time"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#06b6d4', strokeWidth: 1.5, stroke: '#0f172a' }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Disclaimer Note */}
      {showDisclaimer && (
        <DisclaimerBanner className="mt-2" />
      )}
    </div>
  );
};
