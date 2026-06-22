import { ValidationError } from '../utils/errors.js'

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isValidDate = (value) => {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const fail = (field, message, details) => {
      return next(new ValidationError(message, { field, details }))
    }

    if (schema.body) {
      for (const [key, rules] of Object.entries(schema.body)) {
        const value = req.body[key]

        if (rules.required && (value === undefined || value === null)) {
          return fail(key, `${key} is required`)
        }

        if (
          value !== undefined &&
          value !== null &&
          rules.type &&
          typeof value !== rules.type
        ) {
          return fail(
            key,
            `${key} must be a ${rules.type}`,
            `Expected ${rules.type} but received ${typeof value}`
          )
        }

        if (rules.type === 'string' && typeof value === 'string' && !value.trim()) {
          return fail(key, `${key} cannot be empty`)
        }

        if (rules.format === 'email' && value !== undefined && value !== null) {
          if (typeof value !== 'string' || !isValidEmail(value)) {
            return fail(key, `${key} must be a valid email`)
          }
        }

        if (rules.format === 'date' && value !== undefined && value !== null) {
          if (typeof value !== 'string' || !isValidDate(value)) {
            return fail(key, `${key} must be a valid date`)
          }
        }

        if (rules.enum && value !== undefined && value !== null) {
          if (!rules.enum.includes(value)) {
            return fail(
              key,
              `${key} must be one of: ${rules.enum.join(', ')}`,
              `Received "${value}"`
            )
          }
        }
      }
    }

    if (schema.params) {
      for (const [key, rules] of Object.entries(schema.params)) {
        const value = req.params[key]

        if (rules.required && (value === undefined || value === null)) {
          return fail(key, `${key} is required`)
        }

        if (rules.type === 'number') {
          const parsed = Number(value)

          if (Number.isNaN(parsed)) {
            return fail(key, `${key} must be a number`)
          }
        }
      }
    }

    next()
  }
}
