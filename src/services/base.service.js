import prisma from '../config/prisma.js'
import { isPrismaError } from '../utils/prismaError.js'

export const createBaseService = (modelName) => {
  const prismaModel = prisma[modelName]

  return {
    async findMany({ where, orderBy, skip, take } = {}) {
      const [entities, total] = await Promise.all([
        prismaModel.findMany({ where, skip, take, orderBy }),
        prismaModel.count({ where })
      ])
      return { entities, total }
    },

    async findById(id) {
      return prismaModel.findUnique({ where: { id } })
    },

    async create(data) {
      return prismaModel.create({ data })
    },

    async update(id, data) {
      try {
        return await prismaModel.update({ where: { id }, data })
      } catch (error) {
        if (isPrismaError(error, 'P2025')) return null
        throw error
      }
    },

    async delete(id) {
      try {
        return await prismaModel.delete({ where: { id } })
      } catch (error) {
        if (isPrismaError(error, 'P2025')) return null
        throw error
      }
    }
  }
}
