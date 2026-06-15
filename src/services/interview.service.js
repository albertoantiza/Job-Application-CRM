import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
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
        throwPrismaConflict('applicationId', 'application')
      }
      throw error
    }
  },

  async update(id, data) {
    const { applicationId, date, notes, ...rest } = data
    const updateData = { ...rest }
    if (date !== undefined) updateData.date = new Date(date)
    if (notes !== undefined) updateData.notes = notes
    if (applicationId !== undefined && applicationId !== null) {
      updateData.application = { connect: { id: Number(applicationId) } }
    }
    const updated = await base.update(id, updateData)
    if (!updated) throwPrismaNotFound('Interview')
    return updated
  }
}
