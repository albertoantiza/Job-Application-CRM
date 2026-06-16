import prisma from '../config/prisma.js'
import { BadRequestError } from '../utils/errors.js'
import { isPrismaError, throwForeignKeyError, throwNotFound } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const base = createBaseService('interview')

export const interviewService = {
  ...base,

  async create(data) {
    const { applicationId, date, stage, notes } = data
    try {
      return await prisma.interview.create({
        data: {
          date: new Date(date),
          stage,
          notes: notes || null,
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
        details: 'Send at least one of: applicationId, date, stage, notes'
      })
    }
    const { applicationId, date, notes, ...rest } = data
    const updateData = { ...rest }
    if (date !== undefined) updateData.date = new Date(date)
    if (notes !== undefined) updateData.notes = notes
    if (applicationId !== undefined && applicationId !== null) {
      updateData.application = { connect: { id: Number(applicationId) } }
    }
    const updated = await base.update(id, updateData)
    if (!updated) throwNotFound('Interview')
    return updated
  }
}
