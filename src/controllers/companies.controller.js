import { companyService } from '../services/company.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(companyService, {
  entityName: 'Company',
  sortableFields: ['id', 'name', 'website', 'location', 'status', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.location) filters.location = String(query.location)
    if (query.status) filters.status = String(query.status)
    return filters
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
