import { Router } from 'express';
import { getPerformance } from '../controllers/performance.controller';

const router = Router();

router.get('/:driverId', getPerformance);

export default router;