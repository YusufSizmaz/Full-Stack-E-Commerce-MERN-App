import Joi from 'joi';
import logger from './logger.js';

/**
 * Schema for environment variables validation
 */
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .default(8080),
  MONGODB_URI: Joi.string()
    .required()
    .description('MongoDB connection string is required'),
  SECRET_KEY_ACCESS_TOKEN: Joi.string()
    .min(32)
    .required()
    .description('Access token secret must be at least 32 characters'),
  SECRET_KEY_REFRESH_TOKEN: Joi.string()
    .min(32)
    .required()
    .description('Refresh token secret must be at least 32 characters'),
  FRONTEND_URL: Joi.string()
    .uri()
    .required()
    .description('Frontend URL is required for CORS'),
  RESEND_API: Joi.string()
    .optional()
    .description('Resend API key for email service'),
  CLOUDINARY_CLOUD_NAME: Joi.string()
    .required()
    .description('Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: Joi.string()
    .required()
    .description('Cloudinary API key is required'),
  CLOUDINARY_API_SECRET_KEY: Joi.string()
    .required()
    .description('Cloudinary API secret is required'),
  JWT_ACCESS_EXPIRY: Joi.string()
    .default('5h')
    .description('JWT access token expiry time'),
  JWT_REFRESH_EXPIRY: Joi.string()
    .default('7d')
    .description('JWT refresh token expiry time'),
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(900000)
    .description('Rate limit window in milliseconds (default 15 minutes)'),
  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100)
    .description('Maximum requests per window (default 100)'),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info')
}).unknown(true); // Allow unknown keys for flexibility

/**
 * Validate environment variables
 * @returns {object} Validated environment variables
 */
export const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: false
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join('\n');
    logger.error('Environment validation failed:');
    logger.error(errorMessages);
    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  logger.info('Environment variables validated successfully');
  return value;
};

export default validateEnv;
