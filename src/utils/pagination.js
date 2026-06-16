export const parsePagination = (query) => {
  const hasPagination = 'page' in query || 'limit' in query
  if (!hasPagination) return {}

  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20))

  return { skip: (page - 1) * limit, take: limit, page, limit }
}

const DEFAULT_ALLOWED_SORT = ['id', 'createdAt', 'updatedAt']

export const parseSort = (query, allowedFields = DEFAULT_ALLOWED_SORT, defaultSort = { id: 'asc' }) => {
  const { sortBy, sortOrder } = query
  if (sortBy && allowedFields.includes(sortBy)) {
    return { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' }
  }
  return defaultSort
}

export const formatPaginatedResponse = (data, pagination, total) => {
  if (!pagination.page) {
    return { data }
  }
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit)
    }
  }
}
