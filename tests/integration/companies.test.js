import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import prisma from '../../src/config/prisma.js'
import { createTestUser, cleanupDatabase } from '../helpers.js'

const app = (await import('../../src/app.js')).default

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await cleanupDatabase()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET /api/companies', () => {
  it('returns empty list when user has no companies', async () => {
    const { token } = await createTestUser({ email: 'empty@test.com' })

    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ data: [] })
  })

  it('returns companies belonging to the authenticated user', async () => {
    const { token, user } = await createTestUser({ email: 'owner@test.com' })

    await prisma.company.createMany({
      data: [
        { userId: user.id, name: 'Acme Inc', location: 'NYC', status: 'active' },
        { userId: user.id, name: 'Beta Corp', location: 'SF', status: 'active' }
      ]
    })

    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data.map(c => c.name)).toContain('Acme Inc')
    expect(res.body.data.map(c => c.name)).toContain('Beta Corp')
  })

  it('does not return companies from other users', async () => {
    const { token } = await createTestUser({ email: 'alice@test.com' })
    const { user: otherUser } = await createTestUser({ email: 'bob@test.com' })

    await prisma.company.create({
      data: { userId: otherUser.id, name: 'Other User Corp' }
    })

    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(0)
  })
})

describe('GET /api/companies/:id', () => {
  it('returns a company by ID', async () => {
    const { token, user } = await createTestUser({ email: 'byid@test.com' })

    const company = await prisma.company.create({
      data: { userId: user.id, name: 'My Company' }
    })

    const res = await request(app)
      .get(`/api/companies/${company.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      id: company.id,
      name: 'My Company',
      userId: user.id
    })
  })

  it('returns 404 when company belongs to another user', async () => {
    const { token } = await createTestUser({ email: 'user_a@test.com' })
    const { user: userB } = await createTestUser({ email: 'user_b@test.com' })

    const company = await prisma.company.create({
      data: { userId: userB.id, name: 'Not Yours' }
    })

    const res = await request(app)
      .get(`/api/companies/${company.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ error: 'Company not found', status: 404 })
  })

  it('returns 404 for non-existent ID', async () => {
    const { token } = await createTestUser({ email: 'noexist@test.com' })

    const res = await request(app)
      .get('/api/companies/999999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ error: 'Company not found', status: 404 })
  })

  it('returns 400 for non-numeric ID', async () => {
    const { token } = await createTestUser({ email: 'badi d@test.com' })

    const res = await request(app)
      .get('/api/companies/abc')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
  })
})

describe('POST /api/companies', () => {
  it('creates a company', async () => {
    const { token } = await createTestUser({ email: 'creator@test.com' })

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'NewCo', location: 'Berlin', status: 'active' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      name: 'NewCo',
      location: 'Berlin',
      status: 'active'
    })
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data).toHaveProperty('createdAt')
  })

  it('rejects creation without required name field', async () => {
    const { token } = await createTestUser({ email: 'missing@test.com' })

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ location: 'Berlin' })

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({
      error: 'name is required',
      status: 400,
      field: 'name'
    })
  })

  it('rejects invalid status enum value', async () => {
    const { token } = await createTestUser({ email: 'badenum@test.com' })

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'BadCo', status: 'nonexistent' })

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({
      error: 'status must be one of: active, inactive',
      status: 400,
      field: 'status'
    })
  })

  it('rejects empty name string', async () => {
    const { token } = await createTestUser({ email: 'emptyname@test.com' })

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({
      error: 'name cannot be empty',
      status: 400
    })
  })
})

describe('POST /api/companies — malformed body', () => {
  it('returns 400 for invalid JSON body', async () => {
    const { token } = await createTestUser({ email: 'badjson@test.com' })

    const res = await request(app)
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('not-json-at-all')

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ status: 400 })
  })
})

describe('authentication', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/companies')

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      error: 'Authentication required',
      status: 401
    })
  })

  it('returns 401 when an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', 'Bearer invalid-token')

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      error: 'Invalid or expired token',
      status: 401
    })
  })
})
