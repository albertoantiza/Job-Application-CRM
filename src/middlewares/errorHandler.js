import ApiError from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export const errorHandler = (err, req, res, _next) => {
  void _next

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  logger.error(err)

  return res.status(500).json({
    error: 'Internal Server Error'
  })
}
