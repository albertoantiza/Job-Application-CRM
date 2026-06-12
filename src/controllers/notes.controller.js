import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController('note', 'Note', {
  async create(req, res) {
    const { applicationId, content } = req.body
    try {
      const newNote = await prisma.note.create({
        data: {
          content,
          application: { connect: { id: Number(applicationId) } }
        }
      })
      logger.info(`Note ${newNote.id} created`)
      return res.status(201).json({ data: newNote })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('applicationId', 'application')
      }
      throw new BadRequestError('Could not create note', {
        details: error.message
      })
    }
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { applicationId, ...rest } = req.body
    const data = { ...rest }
    if (applicationId !== undefined && applicationId !== null) {
      data.application = { connect: { id: Number(applicationId) } }
    }
    if (!Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: applicationId, content'
      })
    }
    try {
      const updatedNote = await prisma.note.update({ where: { id }, data })
      logger.info(`Note ${id} updated`)
      return res.status(200).json({ data: updatedNote })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        logger.warn(`Note ${id} not found — update`)
        throwPrismaNotFound('Note')
      }
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('applicationId', 'application')
      }
      throw error
    }
  }
})

export const getNotes = ctrl.getAll
export const getNoteById = ctrl.getById
export const createNote = ctrl.create
export const updateNoteById = ctrl.update
export const deleteNoteById = ctrl.delete
