import prisma from '../config/prisma.js'

export const getNotes = async (req, res) => {
  const notes = await prisma.note.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json(notes)
}

export const getNoteById = async (req, res) => {
  const id = Number(req.params.id)

  const note = await prisma.note.findUnique({
    where: { id }
  })

  if (!note) {
    return res.status(404).json({ error: 'Note not found' })
  }

  return res.status(200).json(note)
}

export const createNote = async (req, res) => {
  const { applicationId, content } = req.body

  try {
    const newNote = await prisma.note.create({
      data: {
        applicationId,
        content
      }
    })

    return res.status(201).json(newNote)
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid applicationId',
        details: 'The related application does not exist'
      })
    }

    return res.status(400).json({
      error: 'Could not create note',
      details: error.message
    })
  }
}

export const updateNoteById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...req.body
      }
    })

    return res.status(200).json(updatedNote)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' })
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid applicationId',
        details: 'The related application does not exist'
      })
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' })
    }

    throw error
  }
}
