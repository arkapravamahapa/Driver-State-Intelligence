import React, { useState, useEffect } from 'react';
import { MOCK_RADIO_CALLS, MOCK_LAP_TELEMETRY } from '../data/mockData';
import { DriverState, TopicCategory } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { fetchSessionHistory, SessionHistoryRow } from '../api/sessionHistory';
import { History, Search, Filter, Download, ArrowUpDown } from 'lucide-react';

type SessionStatus = 'loading' | 'success' | 'error';

// The table renders this shape regardless of source (live API or offline
// demo). lapTime/delta come from a client-side join against telemetry mock
// data in demo mode; live /api/session-history does NOT provide
// lapTimeFormatted/deltaVsBest, so those are shown as 'N/A' in live mode
// rather than fabricated (see integration report).
interface DisplayRow {
  id: string;
  time: string;
  lap: number;
  state: string;
  confidence: number;
  topic: string;
  transcript: string;
  lapTime: string;
  delta: string;
}

const toDisplayRow = (row: SessionHistoryRow): DisplayRow => ({
  id: row.id,
  time: row.timestamp,
  lap: row.lapNumber,
  state: row.detectedState,
  confidence: row.confidence,
  topic: row.topic,
  transcript: row.transcript,
  lapTime: 'N/A',
  delta: 'N/A',
});

export const SessionHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'lap' | 'confidence'>('lap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [exportedToast, setExportedToast] = useState(false);

  // ---- Session history now comes from GET /api/session-history instead of
  // the client-side MOCK_RADIO_CALLS + MOCK_LAP_TELEMETRY join.
  // mockData.ts is kept as-is (untouched) and the original join/filter/sort
  // logic is preserved below, used only as the offline/demo fallback.
  const [liveRows, setLiveRows] = useState<SessionHistoryRow[]>([]);
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const buildParams = () => ({
    search: searchQuery || undefined,
    state: selectedState !== 'ALL' ? selectedState : undefined,
    topic: selectedTopic !== 'ALL' ? selectedTopic : undefined,
    // 'confidence' has no backend sortBy equivalent (only lapNumber, stressScore,
    // timestamp are supported) — omit sortBy entirely in that case rather than
    // sending an invalid value; confidence sort is instead applied client-side
    // below, on data the backend already filtered/searched for us.
    sortBy: sortBy === 'lap' ? ('lapNumber' as const) : undefined,
    sortOrder,
  });

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchSessionHistory(buildParams());
        if (cancelled) return;
        setLiveRows(data);
        setIsDemoMode(false);
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load session history.');
        setStatus('error');
      }
    };

    loadHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedState, selectedTopic, sortBy, sortOrder]);

  const handleRetry = () => {
    setStatus('loading');
    setError(null);
    fetchSessionHistory(buildParams())
      .then((data) => {
        setLiveRows(data);
        setIsDemoMode(false);
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load session history.');
        setStatus('error');
      });
  };

  const handleUseDemoData = () => {
    setIsDemoMode(true);
    setStatus('success');
    setError(null);
  };

  // ---- Offline demo mode: original client-side join + filter + sort,
  // unchanged from the pre-integration implementation. ----
  const computeDemoRows = (): DisplayRow[] => {
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

    return combinedData
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
  };

  // ---- Live mode: backend already filtered/searched/sorted (except
  // 'confidence', which it doesn't support — applied client-side here on
  // the already-fetched data, not re-fetched or duplicated). ----
  const computeLiveRows = (): DisplayRow[] => {
    const adapted = liveRows.map(toDisplayRow);
    if (sortBy === 'confidence') {
      return [...adapted].sort((a, b) =>
        sortOrder === 'desc' ? b.confidence - a.confidence : a.confidence - b.confidence
      );
    }
    return adapted;
  };

  const displayRows: DisplayRow[] = isDemoMode ? computeDemoRows() : computeLiveRows();

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
              {status === 'loading' && (
                <tr>
                  <td colSpan={8} className="p-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
                      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                        Loading Session History…
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {status === 'error' && (
                <tr>
                  <td colSpan={8} className="p-8">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                        Unable to Load Session History
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {error ?? 'The request to the backend API failed.'}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-center">
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
                  </td>
                </tr>
              )}

              {status === 'success' && displayRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center font-mono text-xs text-slate-400">
                    No session history rows match the current filters.
                  </td>
                </tr>
              )}

              {status === 'success' && displayRows.map((row) => (
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