import prisma from '../config/prisma.js'
import { isPrismaError, prismaConflictMessage, prismaNotFound } from '../utils/prismaError.js'

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

  return res.status(200).json({ data: contacts })
}

export const getContactById = async (req, res) => {
  const id = Number(req.params.id)

  const contact = await prisma.contact.findUnique({
    where: { id }
  })

  if (!contact) {
    return res.status(404).json(prismaNotFound('Contact'))
  }

  return res.status(200).json({ data: contact })
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

    return res.status(201).json({ data: newContact })
  } catch (error) {
    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('companyId', 'company'))
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
  const data = { ...rest }

  if (companyId === undefined && !Object.keys(data).length) {
    return res.status(400).json({
      error: 'No fields to update',
      details: 'Send at least one of: name, email, companyId'
    })
  }

  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...(companyId === undefined
          ? {}
          : companyId === null
            ? { company: { disconnect: true } }
            : { company: { connect: { id: Number(companyId) } } }),
        ...data
      }
    })

    return res.status(200).json({ data: updatedContact })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Contact'))
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
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Contact'))
    }

    throw error
  }
}
