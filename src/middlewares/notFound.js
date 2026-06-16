import { NotFoundError } from '../utils/errors.js'

export const handleNotFound = (req, res, next) => {
  next(new NotFoundError('Route not found'))
}
