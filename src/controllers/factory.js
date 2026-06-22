import { parsePagination, parseSort, formatPaginatedResponse } from '../utils/pagination.js'
import { logger } from '../utils/logger.js'

export const createEntityController = (service, options = {}, overrides = {}) => {
  const {
    sortableFields = ['id', 'createdAt', 'updatedAt'],
    defaultSort = { id: 'asc' },
    buildFilters = () => ({})
  } = options

  const getAll =
    overrides.getAll ||
    (async (req, res) => {
      const filters = buildFilters(req.query)
      if (req.query.search) filters.search = String(req.query.search)
      const pagination = parsePagination(req.query)
      const orderBy = parseSort(req.query, sortableFields, defaultSort)
      const { entities, total } = await service.findAll(filters, { orderBy, ...pagination })
      const response = formatPaginatedResponse(entities, pagination, total)
      logger.info(`List returned ${entities.length} results`)
      return res.status(200).json(response)
    })

  const getById = async (req, res) => {
    const id = Number(req.params.id)
    const entity = await service.findById(id)
    logger.info(`Entity ${id} retrieved`)
    return res.status(200).json({ data: entity })
  }

  const create = overrides.create || (async (req, res) => {
    const entity = await service.create(req.body)
    logger.info(`Entity ${entity.id} created`)
    return res.status(201).json({ data: entity })
  })

  const update = async (req, res) => {
    const id = Number(req.params.id)
    const entity = await service.update(id, req.body)
    logger.info(`Entity ${id} updated`)
    return res.status(200).json({ data: entity })
  }

  const deleteById = async (req, res) => {
    const id = Number(req.params.id)
    await service.delete(id)
    logger.info(`Entity ${id} deleted`)
    return res.status(204).send()
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteById
  }
}
