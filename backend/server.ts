import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/routes';
import { errorHandler } from './src/middleware/errorHandler';
import { notFound } from './src/middleware/notFound';

const app = express();

// Load environment variables
const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: FRONTEND_URL })); // Secure CORS for your React frontend
app.use(express.json());

// Main API Routes
app.use('/api', routes);

// 404 and Error Handling
app.use(notFound);
app.use(errorHandler);

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`===========================================`);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`✅ Health check: http://localhost:${port}/api/health`);
    console.log(`===========================================`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying ${nextPort}...`);
      if (server.listening) {
        server.close(() => startServer(nextPort));
      } else {
        startServer(nextPort);
      }
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT);