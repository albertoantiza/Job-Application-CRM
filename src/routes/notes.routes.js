import { Router } from 'express'
import {
  getNotes,
  getNoteById,
  createNote
} from '../controllers/notes.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createNoteSchema, noteIdSchema } from '../validators/notes.schema.js'

const router = Router()

router.get('/', getNotes)
router.get('/:id', validateRequest(noteIdSchema), getNoteById)
router.post('/', validateRequest(createNoteSchema), createNote)

export default router
