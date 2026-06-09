import { Router } from 'express'
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompanyById,
  deleteCompanyById
} from '../controllers/companies.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createCompanySchema,
  updateCompanySchema,
  companyIdSchema
} from '../validators/companies.schema.js'

const router = Router()

router.get('/', getCompanies)
router.get('/:id', validateRequest(companyIdSchema), getCompanyById)
router.post('/', validateRequest(createCompanySchema), createCompany)
router.patch('/:id', validateRequest(updateCompanySchema), updateCompanyById)
router.delete('/:id', validateRequest(companyIdSchema), deleteCompanyById)

export default router
