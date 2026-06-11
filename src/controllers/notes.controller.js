import prisma from '../config/prisma.js'
import { isPrismaError, prismaConflictMessage, prismaNotFound } from '../utils/prismaError.js'

export const getNotes = async (req, res) => {
  const notes = await prisma.note.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json({ data: notes })
}

export const getNoteById = async (req, res) => {
  const id = Number(req.params.id)

  const note = await prisma.note.findUnique({
    where: { id }
  })

  if (!note) {
    return res.status(404).json(prismaNotFound('Note'))
  }

  return res.status(200).json({ data: note })
}

export const createNote = async (req, res) => {
  const { applicationId, content } = req.body

  try {
    const newNote = await prisma.note.create({
      data: {
        content,
        application: {
          connect: { id: Number(applicationId) }
        }
      }
    })

    return res.status(201).json({ data: newNote })
  } catch (error) {
    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('applicationId', 'application'))
    }

    return res.status(400).json({
      error: 'Could not create note',
      details: error.message
    })
  }
}

export const updateNoteById = async (req, res) => {
  const id = Number(req.params.id)
  const { applicationId, ...rest } = req.body
  const data = { ...rest }

  if (applicationId !== undefined && applicationId !== null) {
    data.application = { connect: { id: Number(applicationId) } }
  }

  if (!Object.keys(data).length) {
    return res.status(400).json({
      error: 'No fields to update',
      details: 'Send at least one of: applicationId, content'
    })
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data
    })

    return res.status(200).json({ data: updatedNote })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Note'))
    }

    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('applicationId', 'application'))
    }

    throw error
  }
}

export const deleteNoteById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedNote = await prisma.note.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Note deleted successfully',
      data: deletedNote
    })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Note'))
    }

    throw error
  }
}
