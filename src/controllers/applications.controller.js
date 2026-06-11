import prisma from '../config/prisma.js'
import { isPrismaError, prismaConflictMessage, prismaNotFound } from '../utils/prismaError.js'

export const testDb = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      take: 1
    })

    return res.status(200).json({
      data: {
        ok: true,
        count: applications.length
      }
    })
  } catch (error) {
    console.error('testDb failed:', error)
    return res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    })
  }
}

export const getApplications = async (req, res) => {
  const { search, status, companyId } = req.query

  const where = {}

  if (status) {
    where.status = String(status)
  }

  if (companyId) {
    where.companyId = Number(companyId)
  }

  if (search) {
    where.OR = [
      { role: { contains: String(search), mode: 'insensitive' } },
      { status: { contains: String(search), mode: 'insensitive' } }
    ]
  }

  const applications = await prisma.application.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { id: 'asc' }
  })

  return res.status(200).json({ data: applications })
}

export const getApplicationById = async (req, res) => {
  const id = Number(req.params.id)

  const application = await prisma.application.findUnique({
    where: { id }
  })

  if (!application) {
    return res.status(404).json(prismaNotFound('Application'))
  }

    return res.status(200).json({ data: application })
}

export const createApplication = async (req, res) => {
  const { companyId, role, status } = req.body

  try {
    const newApplication = await prisma.application.create({
      data: {
        role,
        status: status || 'applied',
        ...(companyId
          ? {
              company: {
                connect: { id: Number(companyId) }
              }
            }
          : {})
      }
    })

    return res.status(201).json({ data: newApplication })
  } catch (error) {
    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('companyId', 'company'))
    }

    throw error
  }
}

export const updateApplicationById = async (req, res) => {
  const id = Number(req.params.id)
  const { companyId, ...rest } = req.body
  const data = { ...rest }

  if (companyId !== undefined && companyId !== null) {
    data.company = { connect: { id: Number(companyId) } }
  } else if (companyId === null) {
    data.company = { disconnect: true }
  }

  if (!Object.keys(data).length) {
      return res.status(400).json({
        error: 'No fields to update',
        details: 'Send at least one of: companyId, role, status'
      })
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { id },
      data
    })

    return res.status(200).json({ data: updatedApplication })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Application'))
    }

    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json(prismaConflictMessage('companyId', 'company'))
    }

    throw error
  }
}

export const deleteApplicationById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedApplication = await prisma.application.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Application deleted successfully',
      data: deletedApplication
    })
  } catch (error) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json(prismaNotFound('Application'))
    }

    throw error
  }
}
