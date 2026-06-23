import prisma from '../config/prisma.js'
import { ValidationError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['stage', 'notes']
const base = createBaseService('interview')

export const interviewService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = { userId: filters.userId }
    const { search, ...fieldFilters } = filters
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map(field => ({
        [field]: { contains: search, mode: 'insensitive' }
      }))
    }
    if (fieldFilters.applicationId) where.applicationId = Number(fieldFilters.applicationId)
    return base.findMany({ where: Object.keys(where).length ? where : undefined, ...options })
  },

  async create(data) {
    const { userId, applicationId, date, stage, notes } = data
    try {
      return await prisma.interview.create({
        data: {
          userId,
          date: new Date(date),
          stage,
          notes: notes || null,
          applicationId: Number(applicationId)
        }
      })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwForeignKeyError('applicationId', 'application')
      }
      throw error
    }
  },

  async update(id, data) {
    if (!Object.keys(data).length) {
      throw new ValidationError('No fields to update', {
        details: 'Send at least one of: applicationId, date, stage, notes'
      })
    }
    const { applicationId, date, notes, ...rest } = data
    const updateData = { ...rest }
    if (date !== undefined) updateData.date = new Date(date)
    if (notes !== undefined) updateData.notes = notes
    if (applicationId !== undefined && applicationId !== null) {
      updateData.applicationId = Number(applicationId)
    }
    return base.update(id, updateData)
  }
}
