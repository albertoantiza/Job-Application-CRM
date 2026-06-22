import prisma from '../config/prisma.js'
import { InternalError } from '../utils/errors.js'

export const check = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return res.status(200).json({ data: { status: 'ok' } })
  } catch (error) {
    throw new InternalError('Database connection failed', {
      details: error.message
    })
  }
}
