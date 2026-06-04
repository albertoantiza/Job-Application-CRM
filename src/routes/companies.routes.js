import { Router } from 'express'
import {
  getCompanies,
  getCompanyById,
  createCompany
} from '../controllers/companies.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createCompanySchema,
  companyIdSchema
} from '../validators/companies.schema.js'

const router = Router()

router.get('/', getCompanies)
router.get('/:id', validateRequest(companyIdSchema), getCompanyById)
router.post('/', validateRequest(createCompanySchema), createCompany)

export default router
