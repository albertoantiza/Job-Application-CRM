import { Router } from 'express'
import {
  getApplications,
  getApplicationById,
  createApplication
} from '../controllers/applications.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createApplicationSchema,
  applicationIdSchema
} from '../validators/applications.schema.js'

const router = Router()

router.get('/', getApplications)
router.get('/:id', validateRequest(applicationIdSchema), getApplicationById)
router.post('/', validateRequest(createApplicationSchema), createApplication)

export default router
