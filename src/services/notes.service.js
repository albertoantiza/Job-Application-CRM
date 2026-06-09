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

export const updateNote = (id, data) => {
  const note = notes.find((item) => item.id === id)

  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  if (data.applicationId !== undefined) {
    note.applicationId = data.applicationId
  }

  if (data.content !== undefined) {
    note.content = data.content
  }

  return note
}

export const deleteNote = (id) => {
  const index = notes.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new ApiError(404, 'Note not found')
  }

  const deletedNote = notes[index]
  notes.splice(index, 1)

  return deletedNote
}
