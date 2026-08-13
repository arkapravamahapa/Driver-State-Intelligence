import { lapTelemetries, radioCalls } from '../data/mockData';
import { LapTelemetry } from '../types';

/** Formats seconds (e.g. 84.2) as "M:SS.s" (e.g. "1:24.2"), matching the frontend's lapTimeFormatted convention. */
const formatLapTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1).padStart(4, '0');
  return `${minutes}:${secs}`;
};

/**
 * Enriches raw telemetry records with fields the frontend LapTelemetry contract
 * requires but that aren't stored directly: lapTimeFormatted, deltaVsPrevious,
 * deltaVsBest, and driverState. All of these are derived from existing data
 * (lapTelemetries + radioCalls) — nothing here is invented.
 *
 * deltaVsPrevious/deltaVsBest are computed per-driver, using ALL of that
 * driver's known laps (not just the laps in `records`), so results are
 * correct even when `records` is a filtered subset (e.g. a single lap).
 */
const enrichTelemetry = (records: LapTelemetry[]): LapTelemetry[] => {
  const byDriver = new Map<string, LapTelemetry[]>();
  for (const record of lapTelemetries) {
    const list = byDriver.get(record.driverId) ?? [];
    list.push(record);
    byDriver.set(record.driverId, list);
  }
  for (const list of byDriver.values()) {
    list.sort((a, b) => a.lapNumber - b.lapNumber);
  }

  return records.map((record) => {
    const driverLaps = byDriver.get(record.driverId) ?? [];
    const indexInDriver = driverLaps.findIndex((l) => l.lapNumber === record.lapNumber);
    const previousLap = indexInDriver > 0 ? driverLaps[indexInDriver - 1] : undefined;
    const bestLapTime = Math.min(...driverLaps.map((l) => l.lapTimeSeconds));

    // driverState can only be derived when this lap has a linked radio call;
    // there is no other per-lap state source in the backend data.
    const linkedRadioCall = record.radioCallId
      ? radioCalls.find((r) => r.id === record.radioCallId)
      : undefined;

    return {
      ...record,
      lapTimeFormatted: formatLapTime(record.lapTimeSeconds),
      deltaVsPrevious: previousLap
        ? Number((record.lapTimeSeconds - previousLap.lapTimeSeconds).toFixed(1))
        : undefined,
      deltaVsBest: Number((record.lapTimeSeconds - bestLapTime).toFixed(1)),
      driverState: linkedRadioCall?.detectedState,
    };
  });
};

export const telemetryService = {
  getAllTelemetry: (): LapTelemetry[] => enrichTelemetry(lapTelemetries),

  getTelemetryByLap: (lapNumber: number): LapTelemetry[] =>
    enrichTelemetry(lapTelemetries.filter(t => t.lapNumber === lapNumber))
};