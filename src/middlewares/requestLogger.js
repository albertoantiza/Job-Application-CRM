import { logger } from '../utils/logger.js'

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  const { method, originalUrl, query } = req

  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode

    const parts = [`${method} ${originalUrl}`]
    if (Object.keys(query).length) {
      parts.push(`query=${JSON.stringify(query)}`)
    }
    parts.push(`-> ${status} (${duration}ms)`)

    logger.info(parts.join(' '))
  })

  next()
}
