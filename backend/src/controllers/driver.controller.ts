import { Request, Response, NextFunction } from 'express';
import { driverService } from '../services/driver.service';

export const getDrivers = (req: Request, res: Response, next: NextFunction) => {
  try {
    const drivers = driverService.getAllDrivers();
    res.json({ success: true, data: drivers });
  } catch (error) {
    next(error);
  }
};

export const getDriver = (req: Request, res: Response, next: NextFunction) => {
  try {
    const driverId = Array.isArray(req.params.driverId) ? req.params.driverId[0] : req.params.driverId;

    if (!driverId) {
      res.status(400).json({ success: false, message: 'Driver ID is required' });
      return;
    }

    const driver = driverService.getDriverById(driverId);
    
    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }
    
    res.json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};