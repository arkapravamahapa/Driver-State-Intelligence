import { engineerInsights } from '../data/mockData';

export const insightService = {
  getAllInsights: () => engineerInsights,
  getInsightById: (id: string) => engineerInsights.find(i => i.id === id)
};