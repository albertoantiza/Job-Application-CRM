import prisma from '../config/prisma.js'
import bcrypt from 'bcryptjs'
import { ConflictError, NotFoundError } from '../utils/errors.js'

export const userService = {
  async create(data) {
    const { email, password, name } = data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictError('Email already in use')

    const hashedPassword = await bcrypt.hash(password, 10)

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })
  },

  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  },

  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundError('User not found')
    return user
  }
}
