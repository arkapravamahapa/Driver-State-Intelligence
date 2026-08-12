import { radioCalls, lapTelemetries } from '../data/mockData';
import { SessionHistoryFilter, RadioCall } from '../types';

// We extend RadioCall locally to include the stress score for frontend sorting
export interface SessionHistoryItem extends RadioCall {
  stressScore?: number;
}

export const sessionService = {
  getHistory: (filters: SessionHistoryFilter): SessionHistoryItem[] => {
    // 1. Combine Radio Calls with their matching Telemetry to get the stress score
    let result: SessionHistoryItem[] = radioCalls.map(call => {
      const telemetry = lapTelemetries.find(
        t => t.radioCallId === call.id || (t.driverId === call.driverId && t.lapNumber === call.lapNumber)
      );
      
      return {
        ...call,
        stressScore: telemetry?.stressScore
      };
    });

    // 2. Apply Filters
    if (filters.driverId) {
      result = result.filter(item => item.driverId === filters.driverId);
    }
    if (filters.state) {
      result = result.filter(item => item.detectedState === filters.state);
    }
    if (filters.topic) {
      result = result.filter(item => item.topic === filters.topic);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => item.transcript.toLowerCase().includes(searchLower));
    }

    // 3. Apply Sorting
    const sortBy = filters.sortBy || 'timestamp';
    const sortOrder = filters.sortOrder || 'desc';

    result.sort((a, b) => {
      let valA, valB;
      
      if (sortBy === 'stressScore') {
        valA = a.stressScore || 0;
        valB = b.stressScore || 0;
      } else if (sortBy === 'lapNumber') {
        valA = a.lapNumber;
        valB = b.lapNumber;
      } else {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }
};