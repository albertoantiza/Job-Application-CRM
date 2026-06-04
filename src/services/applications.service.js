import ApiError from '../utils/ApiError.js'
import { applications } from '../repositories/applications.repository.js'

export const getAllApplications = () => {
  return applications
}

export const findApplicationById = (id) => {
  const application = applications.find((item) => item.id === id)

  if (!application) {
    throw new ApiError(404, 'Application not found')
  }

  return application
}

export const addApplication = ({ company, role, status = 'applied' }) => {
  const newApplication = {
    id: applications.length + 1,
    company,
    role,
    status,
    appliedAt: new Date().toISOString().split('T')[0]
  }

  applications.push(newApplication)

  return newApplication
}

export const updateApplication = (id, data) => {
  const application = applications.find((item) => item.id === id)

  if (!application) {
    throw new ApiError(404, 'Application not found')
  }

  if (data.company !== undefined) {
    application.company = data.company
  }

  if (data.role !== undefined) {
    application.role = data.role
  }

  if (data.status !== undefined) {
    application.status = data.status
  }

  return application
}

export const deleteApplication = (id) => {
  const index = applications.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new ApiError(404, 'Application not found')
  }

  const deletedApplication = applications[index]
  applications.splice(index, 1)

  return deletedApplication
}
