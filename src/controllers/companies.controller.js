import { companyService } from '../services/company.service.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(companyService, {
  sortableFields: ['id', 'name', 'website', 'location', 'status', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.location) filters.location = String(query.location)
    if (query.status) filters.status = String(query.status)
    return filters
  }
}, {
  async create(req, res) {
    req.body.userId = req.user.userId
    const newCompany = await companyService.create(req.body)
    logger.info(`Company ${newCompany.id} created — name="${req.body.name}"`)
    return res.status(201).json({ data: newCompany })
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
