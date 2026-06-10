import ApiError from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, _next) => {
  void _next

  if (err instanceof ApiError) {
    const payload = {
      error: err.message
    }

    if (err.field) {
      payload.field = err.field
    }

    if (err.details) {
      payload.details = err.details
    }

    return res.status(err.statusCode).json(payload)
  }

  logger.error(err)

  return res.status(500).json({
    error: 'Internal Server Error'
  })
}
