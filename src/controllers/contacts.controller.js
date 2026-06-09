import {
  getAllContacts,
  findContactById,
  addContact,
  updateContact,
  deleteContact
} from '../services/contacts.service.js'

export const getContacts = (req, res) => {
  const contacts = getAllContacts()
  return res.status(200).json(contacts)
}

export const getContactById = (req, res) => {
  const id = Number(req.params.id)
  const contact = findContactById(id)

  return res.status(200).json(contact)
}

export const createContact = (req, res) => {
  const newContact = addContact(req.body)
  return res.status(201).json(newContact)
}

export const updateContactById = (req, res) => {
  const id = Number(req.params.id)
  const updatedContact = updateContact(id, req.body)

  return res.status(200).json(updatedContact)
}

export const deleteContactById = (req, res) => {
  const id = Number(req.params.id)
  const deletedContact = deleteContact(id)

  return res.status(200).json({
    message: 'Contact deleted successfully',
    data: deletedContact
  })
}
