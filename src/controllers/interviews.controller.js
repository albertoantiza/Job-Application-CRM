import prisma from '../config/prisma.js'
import { isPrismaError, prismaConflictMessage, prismaNotFound } from '../utils/prismaError.js'

export const getInterviews = async (req, res) => {
  const interviews = await prisma.interview.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json({ data: interviews })
}

export const getInterviewById = async (req, res) => {
  const id = Number(req.params.id)

  const interview = await prisma.interview.findUnique({
    where: { id }
  })

  if (!interview) {
    return res.status(404).json(prismaNotFound('Interview'))
  }

  return res.status(200).json({ data: interview })
}

export const createInterview = async (req, res) => {
  const { applicationId, date, stage, notes } = req.body

  try {
    const newInterview = await prisma.interview.create({
      data: {
        date: new Date(date),
        stage,
        notes: notes || null,
        application: {
          connect: { id: Number(applicationId) }
        }
      }
    })

    return res.status(201).json({ data: newInterview })
  } catch (error) {
    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('applicationId', 'application'))
    }

    return res.status(400).json({
      error: 'Could not create interview',
      details: error.message
    })
  }
}

export const updateInterviewById = async (req, res) => {
  const id = Number(req.params.id)
  const { applicationId, date, notes, ...rest } = req.body
  const data = { ...rest }

  if (date !== undefined) data.date = new Date(date)
  if (notes !== undefined) data.notes = notes
  if (applicationId !== undefined && applicationId !== null) {
    data.application = { connect: { id: Number(applicationId) } }
  }

  if (!Object.keys(data).length) {
    return res.status(400).json({
      error: 'No fields to update',
      details: 'Send at least one of: applicationId, date, stage, notes'
    })
  }

  try {
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data
    })

    return res.status(200).json({ data: updatedInterview })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Interview'))
    }

    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('applicationId', 'application'))
    }

    throw error
  }
}

export const deleteInterviewById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedInterview = await prisma.interview.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Interview deleted successfully',
      data: deletedInterview
    })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Interview'))
    }

    throw error
  }
}
