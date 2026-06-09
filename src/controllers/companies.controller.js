import {
  getAllCompanies,
  findCompanyById,
  addCompany,
  updateCompany,
  deleteCompany
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

export const updateCompanyById = (req, res) => {
  const id = Number(req.params.id)
  const updatedCompany = updateCompany(id, req.body)

  return res.status(200).json(updatedCompany)
}

export const deleteCompanyById = (req, res) => {
  const id = Number(req.params.id)
  const deletedCompany = deleteCompany(id)

  return res.status(200).json({
    message: 'Company deleted successfully',
    data: deletedCompany
  })
}
