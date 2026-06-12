import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError } from '../utils/errors.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController('contact', 'Contact', {
  async getAll(req, res) {
    const { search, companyId } = req.query
    const where = {}
    if (companyId) where.companyId = Number(companyId)
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
  },
  async create(req, res) {
    const { name, email, companyId } = req.body
    try {
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
      return res.status(201).json({ data: newContact })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('companyId', 'company')
      }
      throw new BadRequestError('Could not create contact', {
        details: error.message
      })
    }
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { companyId, ...rest } = req.body
    const data = { ...rest }
    if (companyId === undefined && !Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
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
        throwPrismaNotFound('Contact')
      }
      throw error
    }
  }
})

export const getContacts = ctrl.getAll
export const getContactById = ctrl.getById
export const createContact = ctrl.create
export const updateContactById = ctrl.update
export const deleteContactById = ctrl.delete
