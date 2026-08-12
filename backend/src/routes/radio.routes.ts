import { Router } from 'express';
import { getRadioCalls, getRadioCall } from '../controllers/radio.controller';

const router = Router();

router.get('/', getRadioCalls);
router.get('/:radioCallId', getRadioCall);

export default router;