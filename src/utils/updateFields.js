import { ValidationError } from './errors.js'

export function requireUpdateFields(data, validFields) {
  const fields = Object.keys(data).filter(k => k !== 'userId')
  if (!fields.length) {
    throw new ValidationError('No fields to update', {
      details: `Send at least one of: ${validFields.join(', ')}`
    })
  }
}
