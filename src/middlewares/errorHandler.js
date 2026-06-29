import ApiError from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, _next) => {
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

  if (err instanceof SyntaxError && err.status === 400) {
    logger.warn(`${req.method} ${req.originalUrl} -> 400 — Malformed request body`)
    return res.status(400).json({
      error: 'Malformed request body',
      type: 'validation',
      status: 400
    })
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    logger.warn(`${req.method} ${req.originalUrl} -> 401 — ${err.message}`)
    return res.status(401).json({
      error: 'Invalid or expired token',
      type: 'auth',
      status: 401
    })
  }

  logger.error(err)

  return res.status(500).json({
    error: 'Internal Server Error',
    type: 'server',
    status: 500
  })
}
