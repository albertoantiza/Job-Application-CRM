import {
  getAllApplications,
  findApplicationById,
  addApplication
} from '../services/applications.service.js'

export const getApplications = (req, res) => {
  const applications = getAllApplications()
  return res.status(200).json(applications)
}

