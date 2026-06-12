import { NotFoundError, BadRequestError } from './errors.js'

export const prismaConflictMessage = (field, relationLabel) => ({
  error: `Related ${relationLabel} not found`,
  details: `The provided ${field} does not reference an existing ${relationLabel}`
})

export const prismaNotFound = (entityName) => ({
  error: `${entityName} not found`
})

export const isPrismaError = (error, code) => {
  return Boolean(error && error.code === code)
}

export const throwPrismaNotFound = (entityName) => {
  throw new NotFoundError(`${entityName} not found`)
}

export const throwPrismaConflict = (field, relationLabel) => {
  throw new BadRequestError(`Related ${relationLabel} not found`, {
    details: `The provided ${field} does not reference an existing ${relationLabel}`
  })
}
