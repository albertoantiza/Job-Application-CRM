import { Router } from 'express'
import {
  getInterviews,
  getInterviewById,
  createInterview
} from '../controllers/interviews.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createInterviewSchema,
  interviewIdSchema
} from '../validators/interviews.schema.js'

const router = Router()

router.get('/', getInterviews)
router.get('/:id', validateRequest(interviewIdSchema), getInterviewById)
router.post('/', validateRequest(createInterviewSchema), createInterview)

export default router
