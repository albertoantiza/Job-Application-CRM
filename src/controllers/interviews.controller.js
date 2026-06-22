import { interviewService } from '../services/interview.service.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(interviewService, {
  sortableFields: ['id', 'stage', 'date', 'applicationId', 'createdAt', 'updatedAt'],
  buildFilters: (query) => {
    const filters = {}
    if (query.applicationId) filters.applicationId = Number(query.applicationId)
    return filters
  }
}, {
  async create(req, res) {
    const newInterview = await interviewService.create(req.body)
    logger.info(`Interview ${newInterview.id} created — stage="${req.body.stage}"`)
    return res.status(201).json({ data: newInterview })
  }
})

export const getAll = ctrl.getAll
export const getById = ctrl.getById
export const create = ctrl.create
export const update = ctrl.update
const _delete = ctrl.delete
export { _delete as delete }
