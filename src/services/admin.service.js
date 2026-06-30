import prisma from '../config/prisma.js'
import { NotFoundError } from '../utils/errors.js'
import { isPrismaError } from '../utils/prismaError.js'

export const adminService = {
  async listUsers() {
    return prisma.user.findMany({
      omit: { password: true },
      orderBy: { id: 'asc' }
    })
  },

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    })
    if (!user) throw new NotFoundError('User not found')
    return user
  },

  async updateRole(id, role) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { role },
        omit: { password: true }
      })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        throw new NotFoundError('User not found')
      }
      throw error
    }
  },

  async deleteUser(id) {
    try {
      await prisma.user.delete({ where: { id } })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        throw new NotFoundError('User not found')
      }
      throw error
    }
  }
}
