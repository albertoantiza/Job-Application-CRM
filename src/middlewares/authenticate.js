import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AuthError } from '../utils/errors.js'

export const authenticate = (req, _res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthError('Authentication required'))
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    req.user = { userId: payload.userId, email: payload.email }
    next()
  } catch {
    next(new AuthError('Invalid or expired token'))
  }
}
