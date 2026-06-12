import { NotFoundError, BadRequestError } from './errors.js'

export const prismaConflictMessage = (field, relationLabel) => ({
  error: `Invalid ${field}`,
  details: `The related ${relationLabel} does not exist`
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
  throw new BadRequestError(`Invalid ${field}`, {
    details: `The related ${relationLabel} does not exist`
  })
}
