import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaNotFound } from '../utils/prismaError.js'
import { logger } from '../utils/logger.js'

export const createEntityController = (modelName, entityName, overrides = {}) => {
  const prismaModel = prisma[modelName]

  const getAll =
    overrides.getAll ||
    (async (req, res) => {
      const entities = await prismaModel.findMany({ orderBy: { id: 'asc' } })
      logger.info(`${entityName} list returned ${entities.length} results`)
      return res.status(200).json({ data: entities })
    })

  const getById = async (req, res) => {
    const id = Number(req.params.id)
    const entity = await prismaModel.findUnique({ where: { id } })
    if (!entity) {
      logger.warn(`${entityName} ${id} not found — getById`)
      throwPrismaNotFound(entityName)
    }
    logger.info(`${entityName} ${id} retrieved`)
    return res.status(200).json({ data: entity })
  }

  const deleteById = async (req, res) => {
    const id = Number(req.params.id)
    try {
      const deletedEntity = await prismaModel.delete({ where: { id } })
      logger.info(`${entityName} ${id} deleted`)
      return res.status(200).json({
        message: `${entityName} deleted successfully`,
        data: deletedEntity
      })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        logger.warn(`${entityName} ${id} not found — deleteById`)
        throwPrismaNotFound(entityName)
      }
      throw error
    }
  }

  return {
    getAll,
    getById,
    create: overrides.create,
    update: overrides.update,
    delete: deleteById
  }
}
