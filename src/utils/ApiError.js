export default class ApiError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
    this.field = options.field
    this.details = options.details
  }
}
