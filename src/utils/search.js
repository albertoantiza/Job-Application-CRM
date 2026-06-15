export const parseSearch = (query, fields) => {
  const { search } = query
  if (!search || !fields.length) return {}

  return {
    OR: fields.map((field) => ({
      [field]: { contains: String(search), mode: 'insensitive' }
    }))
  }
}
