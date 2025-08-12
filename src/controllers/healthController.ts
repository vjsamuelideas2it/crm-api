import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export const healthController = {
  // Main health check
  async check(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      
      const dbResponseTime = Date.now() - startTime;
      
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        database: {
          status: 'connected',
          responseTime: `${dbResponseTime}ms`
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
        }
      };

      logger.info('Health check performed successfully');
      res.status(200).json(healthData);
    } catch (error) {
      logger.error('Health check failed', { error });
      
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Readiness check
  async ready(req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Readiness check failed', { error });
      
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: 'Service not ready'
      });
    }
  },

  // Liveness check
  live(req: Request, res: Response): void {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}; 