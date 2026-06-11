import { createEntityRoutes } from './factory.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/companies.controller.js'
import { createCompanySchema, updateCompanySchema } from '../validators/companies.schema.js'
import { entityIdSchema } from '../validators/common.js'

export default createEntityRoutes(validateRequest, controller, {
  idSchema: entityIdSchema,
  createSchema: createCompanySchema,
  updateSchema: updateCompanySchema
})
