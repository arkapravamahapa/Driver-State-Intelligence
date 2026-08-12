import { lapTelemetries } from '../data/mockData';

export const performanceService = {
  getDriverPerformance: (driverId: string) => lapTelemetries.filter(t => t.driverId === driverId)
};