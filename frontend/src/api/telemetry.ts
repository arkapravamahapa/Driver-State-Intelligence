import { LapTelemetry } from '../types';
import { apiGet } from './client';

/**
 * Fetches all lap telemetry records for the current session.
 * GET /api/telemetry -> { success: true, data: LapTelemetry[] }
 */
export const fetchTelemetry = (): Promise<LapTelemetry[]> => apiGet<LapTelemetry[]>('/telemetry');

/**
 * Fetches telemetry record(s) for a specific lap.
 * GET /api/telemetry/:lapNumber -> { success: true, data: LapTelemetry[] }
 * (The backend filters by lap number and can match more than one driver's
 * telemetry for that lap, so this returns an array.)
 */
export const fetchTelemetryByLap = (lapNumber: number): Promise<LapTelemetry[]> =>
  apiGet<LapTelemetry[]>(`/telemetry/${lapNumber}`);