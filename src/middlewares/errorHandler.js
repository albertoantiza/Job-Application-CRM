import ApiError from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, _next) => {
  void _next

  if (err instanceof ApiError) {
    const payload = {
      error: err.message,
      type: err.type || 'error',
      status: err.statusCode
    }

    if (err.field) {
      payload.field = err.field
    }

    if (err.details) {
      payload.details = err.details
    }

    if (err.statusCode >= 500) {
      logger.error(err)
    } else {
      logger.warn(`${req.method} ${req.originalUrl} -> ${err.statusCode} — ${err.message}`)
    }

    return res.status(err.statusCode).json(payload)
  }

  logger.error(err)

  return res.status(500).json({
    error: 'Internal Server Error',
    type: 'server',
    status: 500
  })
}
