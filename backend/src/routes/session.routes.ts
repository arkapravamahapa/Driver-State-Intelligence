import { Router } from 'express';
import { getSessionHistory } from '../controllers/session.controller';

const router = Router();

router.get('/', getSessionHistory);

export default router;