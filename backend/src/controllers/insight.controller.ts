import { Request, Response, NextFunction } from 'express';
import { insightService } from '../services/insight.service';

export const getInsights = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: insightService.getAllInsights() });
  } catch (error) {
    next(error);
  }
};

export const getInsight = (req: Request, res: Response, next: NextFunction) => {
  try {
    const insightId = Array.isArray(req.params.insightId) ? req.params.insightId[0] : req.params.insightId;

    if (!insightId) {
      res.status(400).json({ success: false, message: 'Insight ID is required' });
      return;
    }

    const insight = insightService.getInsightById(insightId);
    if (!insight) {
      res.status(404).json({ success: false, message: 'Insight not found' });
      return;
    }
    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
};