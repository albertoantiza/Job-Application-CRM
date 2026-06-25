import { adminService } from '../services/admin.service.js'
import { logger } from '../utils/logger.js'

export const listUsers = async (_req, res) => {
  const users = await adminService.listUsers()
  return res.status(200).json({ data: users })
}

export const getUserById = async (req, res) => {
  const id = Number(req.params.id)
  const user = await adminService.getUserById(id)
  return res.status(200).json({ data: user })
}

export const updateRole = async (req, res) => {
  const id = Number(req.params.id)
  const { role } = req.body
  const user = await adminService.updateRole(id, role)
  logger.info(`Admin ${req.user.id} changed user ${id} role to "${role}"`)
  return res.status(200).json({ data: user })
}

export const deleteUser = async (req, res) => {
  const id = Number(req.params.id)
  await adminService.deleteUser(id)
  logger.info(`Admin ${req.user.id} deleted user ${id}`)
  return res.status(204).send()
}
