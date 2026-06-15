import { interviewService } from '../services/interview.service.js'
import { BadRequestError } from '../utils/errors.js'
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
    async update(req, res) {
      const id = Number(req.params.id)
      const { applicationId, date, notes, ...rest } = req.body
      const data = { ...rest }
      if (date !== undefined) data.date = date
      if (notes !== undefined) data.notes = notes
      if (!Object.keys(data).length && applicationId === undefined) {
        throw new BadRequestError('No fields to update', {
          details: 'Send at least one of: applicationId, date, stage, notes'
        })
      }
      const updatedInterview = await interviewService.update(id, { ...data, applicationId })
      logger.info(`Interview ${id} updated`)
      return res.status(200).json({ data: updatedInterview })
    }
  },
  { searchableFields: ['stage', 'notes'] }
)

export const getInterviews = ctrl.getAll
export const getInterviewById = ctrl.getById
export const createInterview = ctrl.create
export const updateInterviewById = ctrl.update
export const deleteInterviewById = ctrl.delete
