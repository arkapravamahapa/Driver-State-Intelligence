import { lapTelemetries } from '../data/mockData';
import { LapTelemetry } from '../types';

export const telemetryService = {
  getAllTelemetry: (): LapTelemetry[] => {
    return lapTelemetries;
  },

  getTelemetryByLap: (lapNumber: number): LapTelemetry[] => {
    return lapTelemetries.filter(t => t.lapNumber === lapNumber);
  }
};