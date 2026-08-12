import { Request, Response, NextFunction } from 'express';
import { performanceService } from '../services/performance.service';

export const getPerformance = (req: Request, res: Response, next: NextFunction) => {
  try {
    const driverId = Array.isArray(req.params.driverId) ? req.params.driverId[0] : req.params.driverId;

    if (!driverId) {
      res.status(400).json({ success: false, message: 'Driver ID is required' });
      return;
    }

    const performance = performanceService.getDriverPerformance(driverId);
    res.json({ success: true, data: performance });
  } catch (error) {
    next(error);
  }
};