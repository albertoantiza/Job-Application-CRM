import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/config/prisma.js', () => ({
  default: {
    company: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

import { createBaseService } from '../../src/services/base.service.js'

describe('BaseService', () => {
  it('should return an object with CRUD methods', () => {
    const service = createBaseService('company')
    expect(service).toHaveProperty('findMany')
    expect(service).toHaveProperty('findById')
    expect(service).toHaveProperty('update')
    expect(service).toHaveProperty('delete')
  })
})
