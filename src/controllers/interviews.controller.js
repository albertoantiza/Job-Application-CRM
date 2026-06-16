import { interviewService } from '../services/interview.service.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(
  'Interview',
  interviewService,
  {
    async create(req, res) {
      const newInterview = await interviewService.create(req.body)
      logger.info(`Interview ${newInterview.id} created — stage="${req.body.stage}"`)
      return res.status(201).json({ data: newInterview })
    },
  },
  { searchableFields: ['stage', 'notes'] }
)

export const getInterviews = ctrl.getAll
export const getInterviewById = ctrl.getById
export const createInterview = ctrl.create
export const updateInterviewById = ctrl.update
export const deleteInterviewById = ctrl.delete
