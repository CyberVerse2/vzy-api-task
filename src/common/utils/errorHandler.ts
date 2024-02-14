import { ENVIRONMENT } from '../configs/environment';
import { logger } from './logger';
import AppError from './appError';
import { ValidationError } from 'class-validator';

function handleValidationError(err: ValidationError) {
  return new AppError(err.value, 400);
}
/**
 * Error handler
 */
export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong';
  err.data = err.data || null;

  const { statusCode, message, data } = err;
  // console.log(err.detail);

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (err.timeout) {
    return res.status(408).send({
      success: false,
      data: null,
      message: 'Request timeout'
    });
  }

  if (statusCode === 404) {
    return res.status(statusCode).json({
      success: false,
      data: null,
      message: message ?? 'resource not found'
    });
  }
  if (err instanceof ValidationError) {
    console.log('error dey validation');
    err = handleValidationError(err);
  }

  if (ENVIRONMENT.APP.ENV === 'local') {
    console.log('==== Error ==== : ', err.stack);

    return res.status(statusCode).json({
      success: false,
      data: data,
      message: message,
      stackTrace: err.stack
    });
  }

  return res.status(statusCode).json({
    success: false,
    data: data,
    message: message
  });
};
