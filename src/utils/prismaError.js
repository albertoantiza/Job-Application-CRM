import { BadRequestError } from './errors.js'

export const isPrismaError = (error, code) => {
  return Boolean(error && error.code === code)
}

export const throwForeignKeyError = (field, relationLabel) => {
  throw new BadRequestError(`Related ${relationLabel} not found`, {
    details: `The provided ${field} does not reference an existing ${relationLabel}`
  })
}
