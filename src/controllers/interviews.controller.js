import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError } from '../utils/errors.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController('interview', 'Interview', {
  async create(req, res) {
    const { applicationId, date, stage, notes } = req.body
    try {
      const newInterview = await prisma.interview.create({
        data: {
          date: new Date(date),
          stage,
          notes: notes || null,
          application: { connect: { id: Number(applicationId) } }
        }
      })
      return res.status(201).json({ data: newInterview })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('applicationId', 'application')
      }
      throw new BadRequestError('Could not create interview', {
        details: error.message
      })
    }
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { applicationId, date, notes, ...rest } = req.body
    const data = { ...rest }
    if (date !== undefined) data.date = new Date(date)
    if (notes !== undefined) data.notes = notes
    if (applicationId !== undefined && applicationId !== null) {
      data.application = { connect: { id: Number(applicationId) } }
    }
    if (!Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: applicationId, date, stage, notes'
      })
    }
    try {
      const updatedInterview = await prisma.interview.update({ where: { id }, data })
      return res.status(200).json({ data: updatedInterview })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        throwPrismaNotFound('Interview')
      }
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('applicationId', 'application')
      }
      throw error
    }
  }
})

export const getInterviews = ctrl.getAll
export const getInterviewById = ctrl.getById
export const createInterview = ctrl.create
export const updateInterviewById = ctrl.update
export const deleteInterviewById = ctrl.delete
