import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { userService } from '../services/user.service.js'
import { AuthError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'

const signToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  })
}

const sanitizeUser = ({ password: _password, ...safe }) => safe

export const register = async (req, res) => {
  const user = await userService.create(req.body)
  const token = signToken(user)
  logger.info(`User ${user.id} registered — email="${user.email}"`)
  return res.status(201).json({ data: { user: sanitizeUser(user), token } })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await userService.findByEmail(email)
  if (!user) throw new AuthError('Invalid email or password')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new AuthError('Invalid email or password')

  const token = signToken(user)
  logger.info(`User ${user.id} logged in — email="${user.email}"`)
  return res.status(200).json({ data: { user: sanitizeUser(user), token } })
}

export const me = async (req, res) => {
  return res.status(200).json({ data: { user: req.user } })
}
