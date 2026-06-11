import { Router } from 'express'

export const createEntityRoutes = (validateRequest, controller, schemas) => {
  const router = Router()

  router.get('/', controller.getAll)
  router.get('/:id', validateRequest(schemas.idSchema), controller.getById)
  router.post('/', validateRequest(schemas.createSchema), controller.create)
  router.patch('/:id', validateRequest(schemas.updateSchema), controller.update)
  router.delete('/:id', validateRequest(schemas.idSchema), controller.delete)

  return router
}
