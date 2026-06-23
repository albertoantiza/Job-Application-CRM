import ApiError from './ApiError.js'

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', options = {}) {
    super(400, message, options)
    this.name = 'BadRequestError'
    this.type = 'bad_request'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', options = {}) {
    super(404, message, options)
    this.name = 'NotFoundError'
    this.type = 'not_found'
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', options = {}) {
    super(400, message, options)
    this.name = 'ValidationError'
    this.type = 'validation'
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Authentication failed', options = {}) {
    super(401, message, options)
    this.name = 'AuthError'
    this.type = 'auth'
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', options = {}) {
    super(409, message, options)
    this.name = 'ConflictError'
    this.type = 'conflict'
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal server error', options = {}) {
    super(500, message, options)
    this.name = 'InternalError'
    this.type = 'server'
  }
}
