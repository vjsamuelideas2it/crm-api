import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

// Custom format for console logs
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Custom format for file logs
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const transports: winston.transport[] = [];

// Use file transports only when running on a filesystem (not serverless)
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  format: fileFormat,
  defaultMeta: { service: 'crm-api' },
  transports,
});

// If we're not in production, log to the console with a simple format
// Always add console in serverless/production environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL === '1') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

export default logger; 