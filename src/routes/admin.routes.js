import { Router } from 'express'
import { authorize } from '../middlewares/authorize.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { entityIdSchema } from '../validators/common.js'
import { updateRoleSchema } from '../validators/admin.schema.js'
import { ROLES } from '../config/permissions.js'
import * as adminController from '../controllers/admin.controller.js'

const router = Router()

router.use(authorize(ROLES.ADMIN))

router.get('/users', adminController.listUsers)
router.get('/users/:id', validateRequest(entityIdSchema), adminController.getUserById)
router.patch('/users/:id/role', validateRequest(entityIdSchema), validateRequest(updateRoleSchema), adminController.updateRole)
router.delete('/users/:id', validateRequest(entityIdSchema), adminController.deleteUser)

export default router
