import prisma from '../config/prisma.js'
import { isPrismaError, throwForeignKeyError, throwNotFound } from '../utils/prismaError.js'
import { createBaseService } from './base.service.js'

const base = createBaseService('contact')

export const contactService = {
  ...base,

  async create(data) {
    const { name, email, companyId, status } = data
    try {
      return await prisma.contact.create({
        data: {
          name,
          email,
          status: status || 'active',
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwForeignKeyError('companyId', 'company')
      }
      throw error
    }
  },

  async update(id, data) {
    const { companyId, ...rest } = data
    const updateData = { ...rest }
    if (companyId !== undefined) {
      updateData.company =
        companyId === null
          ? { disconnect: true }
          : { connect: { id: Number(companyId) } }
    }
    const updated = await base.update(id, updateData)
    if (!updated) throwNotFound('Contact')
    return updated
  }
}
