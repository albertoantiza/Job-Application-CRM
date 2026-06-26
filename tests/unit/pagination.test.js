import { describe, it, expect } from 'vitest'
import { parsePagination, parseSort, formatPaginatedResponse } from '../../src/utils/pagination.js'

describe('parsePagination', () => {
  it('returns empty object when no page/limit in query', () => {
    expect(parsePagination({})).toEqual({})
  })

  it('parses page and limit from query', () => {
    const result = parsePagination({ page: '2', limit: '10' })
    expect(result).toEqual({ skip: 10, take: 10, page: 2, limit: 10 })
  })

  it('clamps page to minimum 1', () => {
    const result = parsePagination({ page: '-5', limit: '10' })
    expect(result.page).toBe(1)
  })

  it('defaults limit to 20 when not provided', () => {
    const result = parsePagination({ page: '1' })
    expect(result.limit).toBe(20)
  })

  it('caps limit at 100', () => {
    const result = parsePagination({ limit: '999' })
    expect(result.limit).toBe(100)
  })
})

describe('parseSort', () => {
  it('returns default sort when no sortBy provided', () => {
    expect(parseSort({})).toEqual({ id: 'asc' })
  })

  it('returns sortBy/sortOrder when field is allowed', () => {
    const result = parseSort({ sortBy: 'createdAt', sortOrder: 'desc' })
    expect(result).toEqual({ createdAt: 'desc' })
  })

  it('ignores sortBy not in allowed fields', () => {
    const result = parseSort({ sortBy: 'name', sortOrder: 'asc' })
    expect(result).toEqual({ id: 'asc' })
  })
})

describe('formatPaginatedResponse', () => {
  it('returns { data } when no pagination page', () => {
    expect(formatPaginatedResponse([1, 2], {})).toEqual({ data: [1, 2] })
  })

  it('includes pagination metadata', () => {
    const result = formatPaginatedResponse([1, 2], { page: 1, limit: 10 }, 25)
    expect(result).toEqual({
      data: [1, 2],
      pagination: { page: 1, limit: 10, total: 25, totalPages: 3 }
    })
  })
})
