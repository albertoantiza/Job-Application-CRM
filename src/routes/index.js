import { Router } from 'express'
import { logger } from '../utils/logger.js'
import * as healthController from '../controllers/health.controller.js'
import applicationsRoutes from './applications.routes.js'
import contactsRoutes from './contacts.routes.js'
import companiesRoutes from './companies.routes.js'
import interviewsRoutes from './interviews.routes.js'
import notesRoutes from './notes.routes.js'

const router = Router()

logger.info('Registering routes...')

router.get('/health', healthController.check)

router.use('/applications', applicationsRoutes)
router.use('/contacts', contactsRoutes)
router.use('/companies', companiesRoutes)
router.use('/interviews', interviewsRoutes)
router.use('/notes', notesRoutes)

router.use('/companies/:companyId/applications', (req, _res, next) => {
  req.query.companyId = req.params.companyId
  next()
}, applicationsRoutes)

router.use('/companies/:companyId/contacts', (req, _res, next) => {
  req.query.companyId = req.params.companyId
  next()
}, contactsRoutes)

router.use('/applications/:applicationId/interviews', (req, _res, next) => {
  req.query.applicationId = req.params.applicationId
  next()
}, interviewsRoutes)

router.use('/applications/:applicationId/notes', (req, _res, next) => {
  req.query.applicationId = req.params.applicationId
  next()
}, notesRoutes)

export default router
