import {
  getAllApplications,
  findApplicationById,
  addApplication
} from '../services/applications.service.js'

export const getApplications = (req, res) => {
  const applications = getAllApplications()
  return res.status(200).json(applications)
}

export const getApplicationById = (req, res) => {
  const id = Number(req.params.id)
  const application = findApplicationById(id)

  return res.status(200).json(application)
}

export const createApplication = (req, res) => {
  const newApplication = addApplication(req.body)

  return res.status(201).json(newApplication)
}
