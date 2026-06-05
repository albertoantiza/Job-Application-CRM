import { Router } from 'express'
import applicationsRoutes from './applications.routes.js'
import contactsRoutes from './contacts.routes.js'
import companiesRoutes from './companies.routes.js'
import interviewsRoutes from './interviews.routes.js'
import notesRoutes from './notes.routes.js'

const router = Router()

console.log('Registering routes...')

router.use('/applications', applicationsRoutes)
router.use('/contacts', contactsRoutes)
router.use('/companies', companiesRoutes)
router.use('/interviews', interviewsRoutes)
router.use('/notes', notesRoutes)

export default router
