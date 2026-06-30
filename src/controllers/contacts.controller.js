import { contactService } from '../services/contact.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(contactService, {
  entityName: 'Contact',
  sortableFields: ['id', 'name', 'email', 'status', 'companyId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.companyId) filters.companyId = Number(query.companyId)
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
