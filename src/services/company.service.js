import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['name', 'website', 'location', 'status']
const base = createBaseService('company')

export const companyService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = { userId: filters.userId }
    const { search, ...fieldFilters } = filters
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map(field => ({
        [field]: { contains: search, mode: 'insensitive' }
      }))
    }
    if (fieldFilters.location) {
      where.location = { contains: fieldFilters.location, mode: 'insensitive' }
    }
    if (fieldFilters.status) where.status = fieldFilters.status
    return base.findMany({ where: Object.keys(where).length ? where : undefined, ...options })
  },

  async create(data) {
    const { userId, name, website, location, status } = data
    return prisma.company.create({
      data: { userId, name, website: website || null, location: location || null, status: status || 'active' }
    })
  },

  async update(id, data) {
    if (!Object.keys(data).length) {
      throw new ValidationError('No fields to update', {
        details: 'Send at least one of: name, website, location, status'
      })
    }
    return base.update(id, data)
  }
}
