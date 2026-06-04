import { Router } from 'express'
import {
  getContacts,
  getContactById,
  createContact
} from '../controllers/contacts.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createContactSchema,
  contactIdSchema
} from '../validators/contacts.schema.js'

const router = Router()

router.get('/', getContacts)
router.get('/:id', validateRequest(contactIdSchema), getContactById)
router.post('/', validateRequest(createContactSchema), createContact)

export default router
