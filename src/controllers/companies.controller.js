import prisma from '../config/prisma.js'

export const getCompanies = async (req, res) => {
  const { search, location } = req.query

  const where = {}

  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { website: { contains: String(search), mode: 'insensitive' } },
      { location: { contains: String(search), mode: 'insensitive' } }
    ]
  }

  if (location) {
    where.location = { contains: String(location), mode: 'insensitive' }
  }

  const companies = await prisma.company.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { id: 'asc' }
  })

  return res.status(200).json(companies)
}

export const getCompanyById = async (req, res) => {
  const id = Number(req.params.id)

  const company = await prisma.company.findUnique({
    where: { id }
  })

  if (!company) {
    return res.status(404).json({ error: 'Company not found' })
  }

  return res.status(200).json(company)
}

export const createCompany = async (req, res) => {
  const { name, website, location } = req.body

  try {
    const newCompany = await prisma.company.create({
      data: {
        name,
        website: website || null,
        location: location || null
      }
    })

    return res.status(201).json(newCompany)
  } catch (error) {
    return res.status(400).json({
      error: 'Could not create company',
      details: error.message
    })
  }
}

export const updateCompanyById = async (req, res) => {
  const id = Number(req.params.id)
  const { name, website, location } = req.body
  const data = {}

  if (name !== undefined) data.name = name
  if (website !== undefined) data.website = website
  if (location !== undefined) data.location = location

  if (!Object.keys(data).length) {
    return res.status(400).json({
      error: 'No fields to update',
      details: 'Send at least one of: name, website, location'
    })
  }

  try {
    const updatedCompany = await prisma.company.update({
      where: { id },
      data
    })

    return res.status(200).json(updatedCompany)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Company not found' })
    }

    throw error
  }
}

export const deleteCompanyById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedCompany = await prisma.company.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Company deleted successfully',
      data: deletedCompany
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Company not found' })
    }

    throw error
  }
}
