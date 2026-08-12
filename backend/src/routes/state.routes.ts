import { Router } from 'express';
import { getDriverState } from '../controllers/state.controller';

const router = Router();

router.get('/:driverId', getDriverState);

export default router;