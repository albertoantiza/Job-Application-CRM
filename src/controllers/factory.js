import { throwNotFound } from '../utils/prismaError.js'
import { parsePagination, parseSort, formatPaginatedResponse } from '../utils/pagination.js'
import { parseSearch } from '../utils/search.js'
import { logger } from '../utils/logger.js'

export const createEntityController = (entityName, service, overrides = {}, options = {}) => {
  const getAll =
    overrides.getAll ||
    (async (req, res) => {
      const searchFilter = parseSearch(req.query, options.searchableFields || [])
      const where = Object.keys(searchFilter).length ? searchFilter : undefined
      const pagination = parsePagination(req.query)
      const orderBy = parseSort(req.query, ['id', 'createdAt', 'updatedAt'])
      const { entities, total } = await service.findMany({ where, orderBy, ...pagination })
      const response = formatPaginatedResponse(entities, pagination, total)
      logger.info(`${entityName} list returned ${entities.length} results`)
      return res.status(200).json(response)
    })

  const getById = async (req, res) => {
    const id = Number(req.params.id)
    const entity = await service.findById(id)
    if (!entity) {
      logger.warn(`${entityName} ${id} not found — getById`)
      throwNotFound(entityName)
    }
    logger.info(`${entityName} ${id} retrieved`)
    return res.status(200).json({ data: entity })
  }

  const create = overrides.create || (async (req, res) => {
    const entity = await service.create(req.body)
    logger.info(`${entityName} ${entity.id} created`)
    return res.status(201).json({ data: entity })
  })

  const update = overrides.update || (async (req, res) => {
    const id = Number(req.params.id)
    const entity = await service.update(id, req.body)
    if (!entity) throwNotFound(entityName)
    logger.info(`${entityName} ${id} updated`)
    return res.status(200).json({ data: entity })
  })

  const deleteById = async (req, res) => {
    const id = Number(req.params.id)
    const deletedEntity = await service.delete(id)
    if (!deletedEntity) {
      logger.warn(`${entityName} ${id} not found — deleteById`)
      throwNotFound(entityName)
    }
    logger.info(`${entityName} ${id} deleted`)
    return res.status(200).json({
      message: `${entityName} deleted successfully`,
      data: deletedEntity
    })
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteById
  }
}
