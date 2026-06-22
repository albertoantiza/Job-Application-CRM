import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['name', 'email', 'status']
const base = createBaseService('contact')

export const contactService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = {}
    const { search, ...fieldFilters } = filters
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map(field => ({
        [field]: { contains: search, mode: 'insensitive' }
      }))
    }
    if (fieldFilters.companyId) where.companyId = Number(fieldFilters.companyId)
    if (fieldFilters.status) where.status = fieldFilters.status
    return base.findMany({ where: Object.keys(where).length ? where : undefined, ...options })
  },

  async create(data) {
    const { name, email, companyId, status } = data
    try {
      return await prisma.contact.create({
        data: {
          name,
          email,
          status: status || 'active',
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwForeignKeyError('companyId', 'company')
      }
      throw error
    }
  },

  async update(id, data) {
    if (!Object.keys(data).length) {
      throw new ValidationError('No fields to update', {
        details: 'Send at least one of: name, email, companyId, status'
      })
    }
    const { companyId, ...rest } = data
    const updateData = { ...rest }
    if (companyId !== undefined) {
      updateData.company =
        companyId === null
          ? { disconnect: true }
          : { connect: { id: Number(companyId) } }
    }
    return base.update(id, updateData)
  }
}
