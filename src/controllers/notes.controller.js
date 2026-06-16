import { noteService } from '../services/note.service.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController('Note', noteService, {}, { searchableFields: ['content'] })

export const getNotes = ctrl.getAll
export const getNoteById = ctrl.getById
export const createNote = ctrl.create
export const updateNoteById = ctrl.update
export const deleteNoteById = ctrl.delete
