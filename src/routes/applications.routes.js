import { Router } from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/applications.controller.js'
import { createApplicationSchema, updateApplicationSchema } from '../validators/applications.schema.js'
import { entityIdSchema } from '../validators/common.js'

const router = Router()

console.log('Applications routes loaded')
console.log(
  'Applications router stack:',
  router.stack.map((layer) => layer.route?.path)
)

router.get('/test-db', controller.testDb)
router.get('/', controller.getAll)
router.get('/:id', validateRequest(entityIdSchema), controller.getById)
router.post('/', validateRequest(createApplicationSchema), controller.create)
router.patch('/:id', validateRequest(updateApplicationSchema), controller.update)
router.delete('/:id', validateRequest(entityIdSchema), controller.delete)

export default router
