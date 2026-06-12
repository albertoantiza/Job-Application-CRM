import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError, InternalError } from '../utils/errors.js'
import { createEntityController } from './factory.js'

export const testDb = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({ take: 1 })
    return res.status(200).json({ data: { ok: true, count: applications.length } })
  } catch (error) {
    throw new InternalError('Database connection failed', {
      details: error.message
    })
  }
}

const ctrl = createEntityController('application', 'Application', {
  async getAll(req, res) {
    const { search, status, companyId } = req.query
    const where = {}
    if (status) where.status = String(status)
    if (companyId) where.companyId = Number(companyId)
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
  },
  async create(req, res) {
    const { companyId, role, status } = req.body
    try {
      const newApplication = await prisma.application.create({
        data: {
          role,
          status: status || 'applied',
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
      return res.status(201).json({ data: newApplication })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('companyId', 'company')
      }
      throw error
    }
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { companyId, ...rest } = req.body
    const data = { ...rest }
    if (companyId !== undefined && companyId !== null) {
      data.company = { connect: { id: Number(companyId) } }
    } else if (companyId === null) {
      data.company = { disconnect: true }
    }
    if (!Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: companyId, role, status'
      })
    }
    try {
      const updatedApplication = await prisma.application.update({ where: { id }, data })
      return res.status(200).json({ data: updatedApplication })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        throwPrismaNotFound('Application')
      }
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('companyId', 'company')
      }
      throw error
    }
  }
})

export const getApplications = ctrl.getAll
export const getApplicationById = ctrl.getById
export const createApplication = ctrl.create
export const updateApplicationById = ctrl.update
export const deleteApplicationById = ctrl.delete
