import { contactService } from '../services/contact.service.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(contactService, {
  sortableFields: ['id', 'name', 'email', 'status', 'companyId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.companyId) filters.companyId = Number(query.companyId)
    if (query.status) filters.status = String(query.status)
    return filters
  }
}, {
  async create(req, res) {
    const newContact = await contactService.create(req.body)
    logger.info(`Contact ${newContact.id} created — name="${req.body.name}"`)
    return res.status(201).json({ data: newContact })
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
