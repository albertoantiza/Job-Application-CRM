import {
  getAllNotes,
  findNoteById,
  addNote
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
