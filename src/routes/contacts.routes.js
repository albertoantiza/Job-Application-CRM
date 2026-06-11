import { createEntityRoutes } from './factory.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/contacts.controller.js'
import { createContactSchema, updateContactSchema } from '../validators/contacts.schema.js'
import { entityIdSchema } from '../validators/common.js'

export default createEntityRoutes(validateRequest, controller, {
  idSchema: entityIdSchema,
  createSchema: createContactSchema,
  updateSchema: updateContactSchema
})
