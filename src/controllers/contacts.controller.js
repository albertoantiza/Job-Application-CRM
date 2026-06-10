import prisma from '../config/prisma.js'

export const getContacts = async (req, res) => {
  const { search, companyId } = req.query

  const where = {}

  if (companyId) {
    where.companyId = Number(companyId)
  }

  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } }
    ]
  }

  const contacts = await prisma.contact.findMany({
    where: Object.keys(where).length ? where : undefined,
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

  try {
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        ...(companyId
          ? {
              company: {
                connect: { id: Number(companyId) }
              }
            }
          : {})
      }
    })

    return res.status(201).json(newContact)
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid companyId',
        details: 'The related company does not exist'
      })
    }

    return res.status(400).json({
      error: 'Could not create contact',
      details: error.message
    })
  }
}

export const updateContactById = async (req, res) => {
  const id = Number(req.params.id)
  const { companyId, ...rest } = req.body

  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...rest,
        ...(companyId === undefined
          ? {}
          : companyId === null
            ? { company: { disconnect: true } }
            : { company: { connect: { id: Number(companyId) } } })
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
