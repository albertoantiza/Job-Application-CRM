import { notes } from '../repositories/notes.repository.js'
import ApiError from '../utils/ApiError.js'

export const getAllNotes = () => {
  return notes
}

export const findNoteById = (id) => {
  const note = notes.find((item) => item.id === id)

  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  return note
}

export const addNote = ({ applicationId, content }) => {
  const newNote = {
    id: notes.length + 1,
    applicationId,
    content
  }

  notes.push(newNote)

  return newNote
}
