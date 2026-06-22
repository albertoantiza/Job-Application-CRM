import { Router } from 'express'
import { logger } from '../utils/logger.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/applications.controller.js'
import { createApplicationSchema, updateApplicationSchema } from '../validators/applications.schema.js'
import { entityIdSchema } from '../validators/common.js'

const router = Router()

logger.info('Applications routes loaded')

router.get('/', controller.getAll)
router.get('/:id', validateRequest(entityIdSchema), controller.getById)
router.post('/', validateRequest(createApplicationSchema), controller.create)
router.patch('/:id', validateRequest(updateApplicationSchema), controller.update)
router.delete('/:id', validateRequest(entityIdSchema), controller.delete)

export default router
