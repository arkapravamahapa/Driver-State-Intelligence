import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';
import { SessionHistoryFilter } from '../types';

export const getSessionHistory = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract query parameters and cast them to our Filter type
    const filters: SessionHistoryFilter = {
      driverId: req.query.driverId as string,
      state: req.query.state as any,
      topic: req.query.topic as any,
      search: req.query.search as string,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };
    
    const history = sessionService.getHistory(filters);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};