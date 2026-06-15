import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const base = createBaseService('application')

export const applicationService = {
  ...base,

  async findManyWithFilters({ where, orderBy, skip, take }) {
    const result = await base.findMany({ where, orderBy, skip, take })
    return result
  },

  async create(data) {
    const { companyId, role, status } = data
    try {
      return await prisma.application.create({
        data: {
          role,
          status: status || 'applied',
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('companyId', 'company')
      }
      throw error
    }
  },

  async update(id, data) {
    const { companyId, ...rest } = data
    const updateData = { ...rest }
    if (companyId !== undefined && companyId !== null) {
      updateData.company = { connect: { id: Number(companyId) } }
    } else if (companyId === null) {
      updateData.company = { disconnect: true }
    }
    const updated = await base.update(id, updateData)
    if (!updated) throwPrismaNotFound('Application')
    return updated
  }
}
