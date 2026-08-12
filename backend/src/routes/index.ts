import { Router, Request, Response } from 'express';
import driverRoutes from './driver.routes';
import radioRoutes from './radio.routes';
import sessionRoutes from './session.routes';
import correlationRoutes from './correlation.routes';
import stateRoutes from './state.routes';
import performanceRoutes from './performance.routes';
import insightRoutes from './insight.routes';

const router = Router();

// Health Check Endpoint (Hackathon Requirement)
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Driver State Intelligence API is running'
  });
});

// Mount all feature routes
router.use('/drivers', driverRoutes);
router.use('/radio', radioRoutes);
router.use('/session-history', sessionRoutes);
router.use('/correlation', correlationRoutes);
router.use('/state', stateRoutes);
router.use('/performance', performanceRoutes);
router.use('/insights', insightRoutes);

export default router;