import prisma from '../config/prisma.js'

export const getContacts = async (req, res) => {
  const contacts = await prisma.contact.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json(contacts)
}

export const getContactById = async (req, res) => {
  const id = Number(req.params.id)

  const contact = await prisma.contact.findUnique({
    where: { id }
  })

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' })
  }

  return res.status(200).json(contact)
}

export const createContact = async (req, res) => {
  const { name, email, companyId } = req.body

  const newContact = await prisma.contact.create({
    data: {
      name,
      email,
      companyId: companyId || null
    }
  })

  return res.status(201).json(newContact)
}

export const updateContactById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...req.body
      }
    })

    return res.status(200).json(updatedContact)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact not found' })
    }

    throw error
  }
}

export const deleteContactById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedContact = await prisma.contact.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Contact deleted successfully',
      data: deletedContact
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact not found' })
    }

    throw error
  }
}
