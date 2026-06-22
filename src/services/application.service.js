import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['role', 'status']
const base = createBaseService('application')

export const applicationService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = {}
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
    const { companyId, role, status } = data
    try {
      return await prisma.application.create({
        data: {
          role,
          status: status || 'applied',
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
        details: 'Send at least one of: companyId, role, status'
      })
    }
    const { companyId, ...rest } = data
    const updateData = { ...rest }
    if (companyId !== undefined && companyId !== null) {
      updateData.company = { connect: { id: Number(companyId) } }
    } else if (companyId === null) {
      updateData.company = { disconnect: true }
    }
    return base.update(id, updateData)
  }
}
