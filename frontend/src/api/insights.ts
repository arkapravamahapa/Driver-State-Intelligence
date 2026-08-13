import { EngineerInsight } from '../types';
import { apiGet } from './client';

/**
 * Fetches all engineer insights for the current session.
 * GET /api/insights -> { success: true, data: EngineerInsight[] }
 */
export const fetchInsights = (): Promise<EngineerInsight[]> => apiGet<EngineerInsight[]>('/insights');

/**
 * Fetches a single engineer insight by id.
 * GET /api/insights/:insightId -> { success: true, data: EngineerInsight }
 */
export const fetchInsight = (id: string): Promise<EngineerInsight> =>
  apiGet<EngineerInsight>(`/insights/${id}`);