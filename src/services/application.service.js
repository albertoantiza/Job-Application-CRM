import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['role', 'status']
const base = createBaseService('application')

export const applicationService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = { userId: filters.userId }
    const { search, ...fieldFilters } = filters
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map(field => ({
        [field]: { contains: search, mode: 'insensitive' }
      }))
    }
    if (fieldFilters.status) where.status = fieldFilters.status
    if (fieldFilters.companyId) where.companyId = Number(fieldFilters.companyId)
    return base.findMany({ where: Object.keys(where).length ? where : undefined, ...options })
  },

  async create(data) {
    const { userId, companyId, role, status } = data
    try {
      return await prisma.application.create({
        data: {
          userId,
          role,
          status: status || 'applied',
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
        details: 'Send at least one of: companyId, role, status'
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
