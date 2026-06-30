import { noteService } from '../services/note.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(noteService, {
  entityName: 'Note',
  sortableFields: ['id', 'content', 'applicationId', 'createdAt', 'updatedAt'],
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
