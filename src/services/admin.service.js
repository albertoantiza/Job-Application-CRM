import prisma from '../config/prisma.js'
import { NotFoundError } from '../utils/errors.js'

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
    } catch {
      throw new NotFoundError('User not found')
    }
  },

  async deleteUser(id) {
    try {
      await prisma.user.delete({ where: { id } })
    } catch {
      throw new NotFoundError('User not found')
    }
  }
}
