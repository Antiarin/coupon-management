import winston from 'winston';

const { combine, timestamp, errors, colorize, printf } = winston.format;

const customFormat = printf((info) => {
  return `${info.timestamp} [${info.level}]: ${info.stack || info.message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    customFormat
  ),
  defaultMeta: { service: 'pantum-coupon-system' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      customFormat
    )
  }));
}