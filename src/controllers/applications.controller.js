import { applicationService } from '../services/application.service.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(applicationService, {
  sortableFields: ['id', 'role', 'status', 'companyId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.status) filters.status = String(query.status)
    if (query.companyId) filters.companyId = Number(query.companyId)
    return filters
  }
}, {
  async create(req, res) {
    req.body.userId = req.user.userId
    const newApplication = await applicationService.create(req.body)
    logger.info(`Application ${newApplication.id} created — role="${req.body.role}"`)
    return res.status(201).json({ data: newApplication })
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
