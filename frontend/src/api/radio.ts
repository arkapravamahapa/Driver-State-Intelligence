import { RadioCall } from '../types';
import { apiGet } from './client';

/**
 * Fetches all radio calls for the current session.
 * GET /api/radio -> { success: true, data: RadioCall[] }
 */
export const fetchRadioCalls = (): Promise<RadioCall[]> => apiGet<RadioCall[]>('/radio');