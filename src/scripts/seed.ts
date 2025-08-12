import dotenv from 'dotenv';
import { seedDatabase } from '../utils/seedData';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function runSeed() {
  try {
    logger.info('Starting database seeding...');
    await seedDatabase();
    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
}

runSeed(); 