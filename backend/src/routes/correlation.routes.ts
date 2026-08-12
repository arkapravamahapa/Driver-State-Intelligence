import { Router } from 'express';
import { getCorrelation } from '../controllers/correlation.controller';

const router = Router();

router.get('/:driverId', getCorrelation);

export default router;