import { noteService } from '../services/note.service.js'
import { BadRequestError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController(
  'Note',
  noteService,
  {
    async create(req, res) {
      const newNote = await noteService.create(req.body)
      logger.info(`Note ${newNote.id} created`)
      return res.status(201).json({ data: newNote })
    },
    async update(req, res) {
      const id = Number(req.params.id)
      const { applicationId, ...rest } = req.body
      const data = { ...rest }
      if (!Object.keys(data).length && applicationId === undefined) {
        throw new BadRequestError('No fields to update', {
          details: 'Send at least one of: applicationId, content'
        })
      }
      const updatedNote = await noteService.update(id, { ...data, applicationId })
      logger.info(`Note ${id} updated`)
      return res.status(200).json({ data: updatedNote })
    }
  },
  { searchableFields: ['content'] }
)

export const getNotes = ctrl.getAll
export const getNoteById = ctrl.getById
export const createNote = ctrl.create
export const updateNoteById = ctrl.update
export const deleteNoteById = ctrl.delete
