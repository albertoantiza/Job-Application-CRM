import { ValidationError } from './errors.js'

export const isPrismaError = (error, code) => {
  return Boolean(error && error.code === code)
}

export const throwForeignKeyError = (field, relationLabel) => {
  throw new ValidationError(`Related ${relationLabel} not found`, {
    field,
    details: `The provided ${field} does not reference an existing ${relationLabel}`
  })
}
