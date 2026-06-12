import ApiError from './ApiError.js'

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', options = {}) {
    super(400, message, options)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', options = {}) {
    super(404, message, options)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', options = {}) {
    super(409, message, options)
    this.name = 'ConflictError'
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', options = {}) {
    super(400, message, options)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', options = {}) {
    super(401, message, options)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', options = {}) {
    super(403, message, options)
    this.name = 'ForbiddenError'
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal server error', options = {}) {
    super(500, message, options)
    this.name = 'InternalError'
  }
}
