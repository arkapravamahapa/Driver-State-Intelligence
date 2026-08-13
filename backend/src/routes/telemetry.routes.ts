import { Router } from 'express';
import { getTelemetry, getTelemetryByLap } from '../controllers/telemetry.controller';

const router = Router();

router.get('/', getTelemetry);
router.get('/:lapNumber', getTelemetryByLap);

export default router;