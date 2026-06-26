import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

vi.mock('../../src/config/prisma.js', () => ({
  default: {
    $queryRaw: vi.fn()
  }
}))

const app = (await import('../../src/app.js')).default

describe('GET /api/health', () => {
  it('returns 200 when database is reachable', async () => {
    const { default: prisma } = await import('../../src/config/prisma.js')
    prisma.$queryRaw.mockResolvedValue([{ '1': 1 }])

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ data: { status: 'ok' } })
  })

  it('returns 500 when database fails', async () => {
    const { default: prisma } = await import('../../src/config/prisma.js')
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'))

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(500)
    expect(res.body).toMatchObject({
      error: 'Database connection failed',
      status: 500
    })
  })
})
