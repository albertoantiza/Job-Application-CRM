import { Router } from 'express'
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationById,
  deleteApplicationById
} from '../controllers/applications.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createApplicationSchema,
  updateApplicationSchema,
  applicationIdSchema
} from '../validators/applications.schema.js'

const router = Router()

console.log('Applications routes loaded')
console.log(
  'Applications router stack:',
  router.stack.map((layer) => layer.route?.path)
)


router.get('/', getApplications)
router.get('/:id', validateRequest(applicationIdSchema), getApplicationById)
router.post('/', validateRequest(createApplicationSchema), createApplication)
router.patch(
  '/:id',
  validateRequest(updateApplicationSchema),
  updateApplicationById
)
router.delete(
  '/:id',
  validateRequest(applicationIdSchema),
  deleteApplicationById
)

export default router
