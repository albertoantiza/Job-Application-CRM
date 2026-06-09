import { companies } from '../repositories/companies.repository.js'
import ApiError from '../utils/ApiError.js'

export const getAllCompanies = () => {
  return companies
}

export const findCompanyById = (id) => {
  const company = companies.find((item) => item.id === id)

  if (!company) {
    throw new ApiError(404, 'Company not found')
  }

  return company
}

export const addCompany = ({ name, website, location }) => {
  const newCompany = {
    id: companies.length + 1,
    name,
    website: website || null,
    location: location || null
  }

  companies.push(newCompany)

  return newCompany
}

export const updateCompany = (id, data) => {
  const company = companies.find((item) => item.id === id)

  if (!company) {
    throw new ApiError(404, 'Company not found')
  }

  if (data.name !== undefined) {
    company.name = data.name
  }

  if (data.website !== undefined) {
    company.website = data.website || null
  }

  if (data.location !== undefined) {
    company.location = data.location || null
  }

  return company
}

export const deleteCompany = (id) => {
  const index = companies.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new ApiError(404, 'Company not found')
  }

  const deletedCompany = companies[index]
  companies.splice(index, 1)

  return deletedCompany
}
