import { Request, Response, NextFunction } from 'express';
import { stateService } from '../services/state.service';

export const getDriverState = (req: Request, res: Response, next: NextFunction) => {
  try {
    const driverId = Array.isArray(req.params.driverId) ? req.params.driverId[0] : req.params.driverId;

    if (!driverId) {
      res.status(400).json({ success: false, message: 'Driver ID is required' });
      return;
    }

    const state = stateService.getDriverState(driverId);
    if (!state) {
      res.status(404).json({ success: false, message: 'Driver state not found' });
      return;
    }
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};