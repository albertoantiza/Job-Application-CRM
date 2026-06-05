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
