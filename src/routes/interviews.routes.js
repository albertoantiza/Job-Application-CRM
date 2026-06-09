import { Router } from 'express'
import {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterviewById,
  deleteInterviewById
} from '../controllers/interviews.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createInterviewSchema,
  updateInterviewSchema,
  interviewIdSchema
} from '../validators/interviews.schema.js'

const router = Router()

router.get('/', getInterviews)
router.get('/:id', validateRequest(interviewIdSchema), getInterviewById)
router.post('/', validateRequest(createInterviewSchema), createInterview)
router.patch('/:id', validateRequest(updateInterviewSchema), updateInterviewById)
router.delete('/:id', validateRequest(interviewIdSchema), deleteInterviewById)

export default router
