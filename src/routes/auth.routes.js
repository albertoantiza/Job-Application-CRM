import { Router } from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as authController from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/authenticate.js'
import { registerSchema, loginSchema } from '../validators/auth.schema.js'

const router = Router()

router.post('/register', validateRequest(registerSchema), authController.register)
router.post('/login', validateRequest(loginSchema), authController.login)
router.get('/me', authenticate, authController.me)

export default router
