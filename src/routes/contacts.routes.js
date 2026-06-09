import { Router } from 'express'
import {
  getContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById
} from '../controllers/contacts.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createContactSchema,
  updateContactSchema,
  contactIdSchema
} from '../validators/contacts.schema.js'

const router = Router()

router.get('/', getContacts)
router.get('/:id', validateRequest(contactIdSchema), getContactById)
router.post('/', validateRequest(createContactSchema), createContact)
router.patch('/:id', validateRequest(updateContactSchema), updateContactById)
router.delete('/:id', validateRequest(contactIdSchema), deleteContactById)

export default router
