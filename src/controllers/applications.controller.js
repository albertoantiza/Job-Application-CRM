import {
  getAllApplications,
  findApplicationById,
  addApplication,
  updateApplication,
  deleteApplication
} from '../services/applications.service.js'

import pool from '../config/db.js'

export const testDb = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    return res.json(result.rows[0])
  } catch (error) {
    console.error('testDb failed:', error)
    return res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    })
  }
}


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

export const updateApplicationById = (req, res) => {
  const id = Number(req.params.id)
  const updatedApplication = updateApplication(id, req.body)

  return res.status(200).json(updatedApplication)
}

export const deleteApplicationById = (req, res) => {
  const id = Number(req.params.id)
  const deletedApplication = deleteApplication(id)

  return res.status(200).json({
    message: 'Application deleted successfully',
    data: deletedApplication
  })
}
