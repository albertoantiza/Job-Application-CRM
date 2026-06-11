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
