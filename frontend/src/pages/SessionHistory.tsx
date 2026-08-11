import React, { useState } from 'react';
import { MOCK_RADIO_CALLS, MOCK_LAP_TELEMETRY } from '../data/mockData';
import { DriverState, TopicCategory } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { History, Search, Filter, Download, ArrowUpDown } from 'lucide-react';

export const SessionHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'lap' | 'confidence'>('lap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [exportedToast, setExportedToast] = useState(false);

  // Combine Radio Calls and Telemetry into Session Row items
  const combinedData = MOCK_RADIO_CALLS.map((call) => {
    const matchingLap = MOCK_LAP_TELEMETRY.find((l) => l.lapNumber === call.lapNumber);
    return {
      id: call.id,
      time: call.timestamp,
      lap: call.lapNumber,
      state: call.detectedState,
      confidence: call.confidence,
      topic: call.topic,
      transcript: call.transcript,
      lapTime: matchingLap ? matchingLap.lapTimeFormatted : '1:24.6',
      delta: matchingLap ? `+${matchingLap.deltaVsBest}s` : '+1.8s',
    };
  });

  const filteredData = combinedData
    .filter((row) => {
      const matchesSearch =
        row.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = selectedState === 'ALL' || row.state === selectedState;
      const matchesTopic = selectedTopic === 'ALL' || row.topic === selectedTopic;
      return matchesSearch && matchesState && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'lap') {
        return sortOrder === 'desc' ? b.lap - a.lap : a.lap - b.lap;
      } else {
        return sortOrder === 'desc' ? b.confidence - a.confidence : a.confidence - b.confidence;
      }
    });

  const handleExport = () => {
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
            Session Radio & State Log History
          </h2>
          <p className="text-xs text-slate-400 sm:text-sm">
            Complete searchable pit-wall database of radio transmissions and state telemetry logs
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {exportedToast && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 flex items-center justify-between">
          <span>✓ Session Telemetry Log CSV successfully generated and downloaded.</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search transcript or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL STATES</option>
            <option value="CALM">CALM</option>
            <option value="CONCERNED">CONCERNED</option>
            <option value="STRESSED">STRESSED</option>
          </select>
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
          <span>Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL TOPICS</option>
            <option value="TYRE / GRIP">TYRE / GRIP</option>
            <option value="CAR BALANCE">CAR BALANCE</option>
            <option value="BRAKE BIAS">BRAKE BIAS</option>
            <option value="TRAFFIC / GAP">TRAFFIC / GAP</option>
          </select>
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-300 hover:bg-slate-800 transition cursor-pointer"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <span>SORT {sortOrder.toUpperCase()}</span>
        </button>
      </div>

      {/* Main Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-500 uppercase">
              <tr>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Lap</th>
                <th className="p-3.5">Detected State</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Topic</th>
                <th className="p-3.5">Lap Pace</th>
                <th className="p-3.5">Delta</th>
                <th className="p-3.5 font-sans">Transcript Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 text-slate-400">{row.time}</td>
                  <td className="p-3.5 font-bold text-white">LAP {row.lap}</td>
                  <td className="p-3.5">
                    <StatusBadge state={row.state as DriverState} size="sm" />
                  </td>
                  <td className="p-3.5 text-emerald-400 font-bold">{row.confidence}%</td>
                  <td className="p-3.5 text-blue-400 font-semibold">{row.topic}</td>
                  <td className="p-3.5 font-bold text-cyan-400">{row.lapTime}</td>
                  <td className="p-3.5 text-amber-400">{row.delta}</td>
                  <td className="p-3.5 font-sans text-slate-300 italic max-w-xs truncate">
                    &ldquo;{row.transcript}&rdquo;
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
