import { Request, Response, NextFunction } from 'express';
import { correlationService } from '../services/correlation.service';

export const getCorrelation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const driverId = Array.isArray(req.params.driverId) ? req.params.driverId[0] : req.params.driverId;

    if (!driverId) {
      res.status(400).json({ success: false, message: 'Driver ID is required' });
      return;
    }

    const correlation = correlationService.getCorrelationData(driverId);
    res.json({ success: true, data: correlation });
  } catch (error) {
    next(error);
  }
};
