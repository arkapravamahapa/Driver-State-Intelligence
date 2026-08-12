import { radioCalls } from '../data/mockData';

export const stateService = {
  getDriverState: (driverId: string) => {
    // Get the most recent radio call state for the driver
    const calls = radioCalls.filter(r => r.driverId === driverId);
    if (!calls.length) return null;
    return { driverId, currentState: calls[0].detectedState };
  }
};