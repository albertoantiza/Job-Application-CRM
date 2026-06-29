import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../src/config/prisma.js'
import { env } from '../src/config/env.js'

const TABLES = ['Note', 'Interview', 'Contact', 'Application', 'Company', 'User']

export async function cleanupDatabase() {
  for (const table of TABLES) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`)
  }
}

export async function createTestUser(overrides = {}) {
  const password = await bcrypt.hash('testpassword123', 10)

  const user = await prisma.user.create({
    data: {
      email: overrides.email || 'test@example.com',
      password,
      name: overrides.name || 'Test User',
      role: overrides.role || 'user'
    }
  })

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: '1h'
  })

  return { user, token, password: 'testpassword123' }
}

export function authHeader(token) {
  return ['Authorization', `Bearer ${token}`]
}
