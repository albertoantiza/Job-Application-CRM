import ApiError from '../utils/ApiError.js'

export const validateRequest = (schema) => {
  return (req, res, next) => {
    if (schema.body) {
      for (const [key, rules] of Object.entries(schema.body)) {
        const value = req.body[key]

        if (rules.required && (value === undefined || value === null)) {
          return next(new ApiError(400, `${key} is required`))
        }

        if (rules.type && typeof value !== rules.type) {
          return next(new ApiError(400, `${key} must be a ${rules.type}`))
        }

        if (rules.type === 'string' && !value.trim()) {
          return next(new ApiError(400, `${key} cannot be empty`))
        }
      }
    }

    if (schema.params) {
      for (const [key, rules] of Object.entries(schema.params)) {
        const value = req.params[key]

        if (rules.required && (value === undefined || value === null)) {
          return next(new ApiError(400, `${key} is required`))
        }

        if (rules.type === 'number') {
          const parsed = Number(value)

          if (Number.isNaN(parsed)) {
            return next(new ApiError(400, `${key} must be a number`))
          }
        }
      }
    }

    next()
  }
}
