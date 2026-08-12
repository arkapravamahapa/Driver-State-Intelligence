import { Router } from 'express';
import { getInsights, getInsight } from '../controllers/insight.controller';

const router = Router();

router.get('/', getInsights);
router.get('/:insightId', getInsight);

export default router;