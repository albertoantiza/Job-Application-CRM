import { applicationService } from '../services/application.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(applicationService, {
  entityName: 'Application',
  sortableFields: ['id', 'role', 'status', 'companyId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.status) filters.status = String(query.status)
    if (query.companyId) filters.companyId = Number(query.companyId)
    return filters
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
