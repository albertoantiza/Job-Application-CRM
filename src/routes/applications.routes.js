import { createEntityRoutes } from './factory.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/applications.controller.js'
import { createApplicationSchema, updateApplicationSchema } from '../validators/applications.schema.js'
import { entityIdSchema } from '../validators/common.js'

export default createEntityRoutes(validateRequest, controller, {
  idSchema: entityIdSchema,
  createSchema: createApplicationSchema,
  updateSchema: updateApplicationSchema
})
