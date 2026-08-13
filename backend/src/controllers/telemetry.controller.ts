import { Request, Response, NextFunction } from 'express';
import { telemetryService } from '../services/telemetry.service';

export const getTelemetry = (req: Request, res: Response, next: NextFunction) => {
  try {
    const telemetry = telemetryService.getAllTelemetry();
    res.json({ success: true, data: telemetry });
  } catch (error) {
    next(error);
  }
};

export const getTelemetryByLap = (req: Request, res: Response, next: NextFunction) => {
  try {
    const lapNumberParam = Array.isArray(req.params.lapNumber) ? req.params.lapNumber[0] : req.params.lapNumber;

    if (!lapNumberParam) {
      res.status(400).json({ success: false, message: 'Lap number is required' });
      return;
    }

    const lapNumber = parseInt(lapNumberParam, 10);
    const telemetry = telemetryService.getTelemetryByLap(lapNumber);

    if (!telemetry.length) {
      res.status(404).json({ success: false, message: 'Telemetry not found for this lap' });
      return;
    }

    res.json({ success: true, data: telemetry });
  } catch (error) {
    next(error);
  }
};