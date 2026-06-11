import prisma from '../config/prisma.js'
import { isPrismaError, prismaNotFound } from '../utils/prismaError.js'

export const createEntityController = (modelName, entityName, overrides = {}) => {
  const prismaModel = prisma[modelName]

  const getAll =
    overrides.getAll ||
    (async (req, res) => {
      const entities = await prismaModel.findMany({ orderBy: { id: 'asc' } })
      return res.status(200).json({ data: entities })
    })

  const getById = async (req, res) => {
    const id = Number(req.params.id)
    const entity = await prismaModel.findUnique({ where: { id } })
    if (!entity) {
      return res.status(404).json(prismaNotFound(entityName))
    }
    return res.status(200).json({ data: entity })
  }

  const deleteById = async (req, res) => {
    const id = Number(req.params.id)
    try {
      const deletedEntity = await prismaModel.delete({ where: { id } })
      return res.status(200).json({
        message: `${entityName} deleted successfully`,
        data: deletedEntity
      })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return res.status(404).json(prismaNotFound(entityName))
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
