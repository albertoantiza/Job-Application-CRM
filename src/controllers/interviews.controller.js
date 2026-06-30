import { interviewService } from '../services/interview.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(interviewService, {
  entityName: 'Interview',
  sortableFields: ['id', 'stage', 'date', 'applicationId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.applicationId) filters.applicationId = Number(query.applicationId)
    return filters
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
