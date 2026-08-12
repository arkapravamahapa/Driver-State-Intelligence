import { Router, Request, Response, NextFunction } from 'express';
import { lapTelemetries } from '../data/mockData';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: lapTelemetries });
  } catch (error) {
    next(error);
  }
});

router.get('/:lapNumber', (req: Request, res: Response, next: NextFunction) => {
  try {
    const lapNumberParam = Array.isArray(req.params.lapNumber) ? req.params.lapNumber[0] : req.params.lapNumber;

    if (!lapNumberParam) {
      res.status(400).json({ success: false, message: 'Lap number is required' });
      return;
    }

    const lapNumber = parseInt(lapNumberParam, 10);
    const telemetry = lapTelemetries.filter(t => t.lapNumber === lapNumber);
    if (!telemetry.length) {
      res.status(404).json({ success: false, message: 'Telemetry not found for this lap' });
      return;
    }
    res.json({ success: true, data: telemetry });
  } catch (error) {
    next(error);
  }
});

export default router;