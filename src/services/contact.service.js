import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['name', 'email', 'status']
const base = createBaseService('contact')

export const contactService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = { userId: filters.userId }
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
    const { userId, name, email, companyId, status } = data
    try {
      return await prisma.contact.create({
        data: {
          name,
          email,
          userId,
          status: status || 'active',
          companyId: companyId ? Number(companyId) : null
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
      updateData.companyId = companyId !== null ? Number(companyId) : null
    }
    return base.update(id, updateData)
  }
}
