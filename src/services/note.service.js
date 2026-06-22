import prisma from '../config/prisma.js'
import { BadRequestError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const SEARCHABLE_FIELDS = ['content']
const base = createBaseService('note')

export const noteService = {
  ...base,

  async findAll(filters = {}, options = {}) {
    const where = {}
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
    const { applicationId, content } = data
    try {
      return await prisma.note.create({
        data: {
          content,
          application: { connect: { id: Number(applicationId) } }
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
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: applicationId, content'
      })
    }
    const { applicationId, ...rest } = data
    const updateData = { ...rest }
    if (applicationId !== undefined && applicationId !== null) {
      updateData.application = { connect: { id: Number(applicationId) } }
    }
    return base.update(id, updateData)
  }
}
