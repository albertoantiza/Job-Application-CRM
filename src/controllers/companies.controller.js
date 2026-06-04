import {
  getAllCompanies,
  findCompanyById,
  addCompany
} from '../services/companies.service.js'

export const getCompanies = (req, res) => {
  const companies = getAllCompanies()
  return res.status(200).json(companies)
}

export const getCompanyById = (req, res) => {
  const id = Number(req.params.id)
  const company = findCompanyById(id)

  return res.status(200).json(company)
}

export const createCompany = (req, res) => {
  const newCompany = addCompany(req.body)
  return res.status(201).json(newCompany)
}
