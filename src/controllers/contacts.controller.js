import {
  getAllContacts,
  findContactById,
  addContact
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
