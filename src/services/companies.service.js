import { contacts } from '../repositories/contacts.repository.js'
import ApiError from '../utils/ApiError.js'

export const getAllContacts = () => {
  return contacts
}

export const findContactById = (id) => {
  const contact = contacts.find((item) => item.id === id)

  if (!contact) {
    throw new ApiError(404, 'Contact not found')
  }

  return contact
}

export const addContact = ({ name, email, companyId }) => {
  const newContact = {
    id: contacts.length + 1,
    name,
    email,
    companyId: companyId || null
  }

  contacts.push(newContact)

  return newContact
}
