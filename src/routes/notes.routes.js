import { createEntityRoutes } from './factory.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/notes.controller.js'
import { createNoteSchema, updateNoteSchema } from '../validators/notes.schema.js'
import { entityIdSchema } from '../validators/common.js'

export default createEntityRoutes(validateRequest, controller, {
  idSchema: entityIdSchema,
  createSchema: createNoteSchema,
  updateSchema: updateNoteSchema
})
