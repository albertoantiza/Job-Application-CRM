import { applicationService } from '../services/application.service.js'
import { parsePagination, parseSort, formatPaginatedResponse } from '../utils/pagination.js'
import { parseSearch } from '../utils/search.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const SEARCHABLE_FIELDS = ['role', 'status']
const ALLOWED_SORT = ['id', 'role', 'status', 'companyId', 'createdAt', 'updatedAt']

const ctrl = createEntityController('Application', applicationService, {
  async getAll(req, res) {
    const { status, companyId } = req.query
    const where = {
      ...parseSearch(req.query, SEARCHABLE_FIELDS)
    }
    if (status) where.status = String(status)
    if (companyId) where.companyId = Number(companyId)
    const pagination = parsePagination(req.query)
    const orderBy = parseSort(req.query, ALLOWED_SORT, { id: 'asc' })
    const { entities, total } = await applicationService.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy,
      ...pagination
    })
    const response = formatPaginatedResponse(entities, pagination, total)
    logger.info(`Application list returned ${entities.length} results`)
    return res.status(200).json(response)
  },
  async create(req, res) {
    const newApplication = await applicationService.create(req.body)
    logger.info(`Application ${newApplication.id} created — role="${req.body.role}"`)
    return res.status(201).json({ data: newApplication })
  },
}, { searchableFields: SEARCHABLE_FIELDS })

export const getApplications = ctrl.getAll
export const getApplicationById = ctrl.getById
export const createApplication = ctrl.create
export const updateApplicationById = ctrl.update
export const deleteApplicationById = ctrl.delete
