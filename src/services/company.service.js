import prisma from '../config/prisma.js'
import { BadRequestError } from '../utils/errors.js'
import { throwNotFound } from '../utils/prismaError.js'
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
    if (!Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: name, website, location, status'
      })
    }
    const updated = await base.update(id, data)
    if (!updated) throwNotFound('Company')
    return updated
  }
}
