import prisma from '../config/prisma.js'
import { isPrismaError, throwForeignKeyError, throwNotFound } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const base = createBaseService('note')

export const noteService = {
  ...base,

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
    const { applicationId, ...rest } = data
    const updateData = { ...rest }
    if (applicationId !== undefined && applicationId !== null) {
      updateData.application = { connect: { id: Number(applicationId) } }
    }
    const updated = await base.update(id, updateData)
    if (!updated) throwNotFound('Note')
    return updated
  }
}
