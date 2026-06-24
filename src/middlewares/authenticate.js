import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { env } from '../config/env.js'
import { AuthError } from '../utils/errors.js'

export const authenticate = async (req, _res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthError('Authentication required'))
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      omit: { password: true }
    })
    if (!user) return next(new AuthError('User not found'))
    req.user = user
    next()
  } catch {
    next(new AuthError('Invalid or expired token'))
  }
}
