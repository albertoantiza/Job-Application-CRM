import {
  getAllNotes,
  findNoteById,
  addNote,
  updateNote,
  deleteNote
} from '../services/notes.service.js'

export const getNotes = (req, res) => {
  const notes = getAllNotes()
  return res.status(200).json(notes)
}

export const getNoteById = (req, res) => {
  const id = Number(req.params.id)
  const note = findNoteById(id)

  return res.status(200).json(note)
}

export const createNote = (req, res) => {
  const newNote = addNote(req.body)
  return res.status(201).json(newNote)
}

export const updateNoteById = (req, res) => {
  const id = Number(req.params.id)
  const updatedNote = updateNote(id, req.body)

  return res.status(200).json(updatedNote)
}

export const deleteNoteById = (req, res) => {
  const id = Number(req.params.id)
  const deletedNote = deleteNote(id)

  return res.status(200).json({
    message: 'Note deleted successfully',
    data: deletedNote
  })
}
