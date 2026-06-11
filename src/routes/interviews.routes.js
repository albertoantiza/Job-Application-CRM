import { createEntityRoutes } from './factory.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import * as controller from '../controllers/interviews.controller.js'
import { createInterviewSchema, updateInterviewSchema } from '../validators/interviews.schema.js'
import { entityIdSchema } from '../validators/common.js'

export default createEntityRoutes(validateRequest, controller, {
  idSchema: entityIdSchema,
  createSchema: createInterviewSchema,
  updateSchema: updateInterviewSchema
})
