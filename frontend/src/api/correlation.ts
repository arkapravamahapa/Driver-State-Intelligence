import { apiGet } from './client';

/**
 * Shape returned by GET /api/correlation/:driverId. There's no Correlation
 * type in the shared frontend/src/types/index.ts, so this is defined
 * locally here rather than modifying shared types.
 */
export interface CorrelationLap {
  lapNumber: number;
  lapTimeSeconds: number;
  stressScore: number;
  rearTyreTempC: number;
  driverState: 'CALM' | 'CONCERNED' | 'STRESSED' | 'TIRED';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  topic: string | null;
  radioTranscript: string | null;
}

/**
 * Fetches per-lap stress/telemetry/radio correlation data for a driver.
 * GET /api/correlation/:driverId -> { success: true, data: CorrelationLap[] }
 */
export const fetchCorrelation = (driverId: string): Promise<CorrelationLap[]> =>
  apiGet<CorrelationLap[]>(`/correlation/${driverId}`);