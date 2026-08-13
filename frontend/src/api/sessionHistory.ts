import { apiGet } from './client';

/**
 * Shape returned by GET /api/session-history — a RadioCall plus a joined
 * stressScore. There's no dedicated type for this in the shared
 * frontend/src/types/index.ts, so it's defined locally here rather than
 * modifying shared types.
 */
export interface SessionHistoryRow {
  id: string;
  driverId: string;
  driverName: string;
  lapNumber: number;
  channel: string;
  audioDuration: number;
  transcript: string;
  highlightedPhrase?: string;
  topic: string;
  sentiment: string;
  detectedState: string;
  confidence: number;
  keyPhrases: string[];
  sector?: string;
  timestamp: string;
  stressScore?: number;
}

export interface SessionHistoryParams {
  driverId?: string;
  state?: string;
  topic?: string;
  search?: string;
  sortBy?: 'lapNumber' | 'stressScore' | 'timestamp';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetches session history rows, filtered/sorted server-side.
 * GET /api/session-history?<params> -> { success: true, data: SessionHistoryRow[] }
 * Omits any param that is undefined/empty rather than sending it blank.
 */
export const fetchSessionHistory = (params: SessionHistoryParams = {}): Promise<SessionHistoryRow[]> => {
  const query = new URLSearchParams();
  if (params.driverId) query.set('driverId', params.driverId);
  if (params.state) query.set('state', params.state);
  if (params.topic) query.set('topic', params.topic);
  if (params.search) query.set('search', params.search);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const qs = query.toString();
  return apiGet<SessionHistoryRow[]>(`/session-history${qs ? `?${qs}` : ''}`);
};