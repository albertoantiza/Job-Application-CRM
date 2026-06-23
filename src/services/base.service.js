import prisma from '../config/prisma.js'
import { isPrismaError } from '../utils/prismaError.js'
import { NotFoundError } from '../utils/errors.js'

export const createBaseService = (modelName) => {
  const prismaModel = prisma[modelName]
  const entityName = modelName.charAt(0).toUpperCase() + modelName.slice(1)

  return {
    async findMany({ where, orderBy, skip, take } = {}) {
      const [entities, total] = await Promise.all([
        prismaModel.findMany({ where, skip, take, orderBy }),
        prismaModel.count({ where })
      ])
      return { entities, total }
    },

    async findById(id, userId) {
      const entity = await prismaModel.findUnique({ where: { id, userId } })
      if (!entity) throw new NotFoundError(`${entityName} not found`)
      return entity
    },

    async update(id, data) {
      const { userId, ...rest } = data
      try {
        return await prismaModel.update({ where: { id, userId }, data: rest })
      } catch (error) {
        if (isPrismaError(error, 'P2025')) throw new NotFoundError(`${entityName} not found`)
        throw error
      }
    },

    async delete(id, userId) {
      try {
        return await prismaModel.delete({ where: { id, userId } })
      } catch (error) {
        if (isPrismaError(error, 'P2025')) throw new NotFoundError(`${entityName} not found`)
        throw error
      }
    }
  }
}
