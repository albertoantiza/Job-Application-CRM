import { applications } from '../repositories/applications.repository.js'
import ApiError from '../utils/ApiError.js'

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

export const addApplication = ({ company, role }) => {
  const newApplication = {
    id: applications.length + 1,
    company,
    role
  }

  applications.push(newApplication)

  return newApplication
}
