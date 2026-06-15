import prisma from '../config/prisma.js'
import { throwPrismaNotFound } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const base = createBaseService('company')

export const companyService = {
  ...base,

  async create(data) {
    const { name, website, location, status } = data
    return prisma.company.create({
      data: { name, website: website || null, location: location || null, status: status || 'active' }
    })
  },

  async update(id, data) {
    const updated = await base.update(id, data)
    if (!updated) throwPrismaNotFound('Company')
    return updated
  }
}
