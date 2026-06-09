import { Router } from 'express'
import {
  getNotes,
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById
} from '../controllers/notes.controller.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema
} from '../validators/notes.schema.js'

const router = Router()

router.get('/', getNotes)
router.get('/:id', validateRequest(noteIdSchema), getNoteById)
router.post('/', validateRequest(createNoteSchema), createNote)
router.patch('/:id', validateRequest(updateNoteSchema), updateNoteById)
router.delete('/:id', validateRequest(noteIdSchema), deleteNoteById)

export default router
