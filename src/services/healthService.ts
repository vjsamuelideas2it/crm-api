import { prisma } from '../prisma/client';

export const healthService = {
  async getHealthStatus() {
    const timestamp = new Date().toISOString();
    
    // Check database connectivity
    let databaseStatus = 'connected';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      databaseStatus = 'disconnected';
    }

    return {
      success: true,
      message: 'API is healthy',
      timestamp,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: databaseStatus,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    };
  },
}; 