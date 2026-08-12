import { Router } from 'express';
import { getDrivers, getDriver } from '../controllers/driver.controller';

const router = Router();

router.get('/', getDrivers);
router.get('/:driverId', getDriver);

export default router;