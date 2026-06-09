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

export const updateContact = (id, data) => {
  const contact = contacts.find((item) => item.id === id)

  if (!contact) {
    throw new ApiError(404, 'Contact not found')
  }

  if (data.name !== undefined) {
    contact.name = data.name
  }

  if (data.email !== undefined) {
    contact.email = data.email
  }

  if (data.companyId !== undefined) {
    contact.companyId = data.companyId || null
  }

  return contact
}

export const deleteContact = (id) => {
  const index = contacts.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new ApiError(404, 'Contact not found')
  }

  const deletedContact = contacts[index]
  contacts.splice(index, 1)

  return deletedContact
}
