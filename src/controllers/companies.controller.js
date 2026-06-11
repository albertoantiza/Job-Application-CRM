import prisma from '../config/prisma.js'
import { isPrismaError, prismaNotFound } from '../utils/prismaError.js'
import { createEntityController } from './factory.js'

const ctrl = createEntityController('company', 'Company', {
  async getAll(req, res) {
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
    return res.status(200).json({ data: companies })
  },
  async create(req, res) {
    const { name, website, location } = req.body
    try {
      const newCompany = await prisma.company.create({
        data: { name, website: website || null, location: location || null }
      })
      return res.status(201).json({ data: newCompany })
    } catch (error) {
      return res.status(400).json({
        error: 'Could not create company',
        details: error.message
      })
    }
  },
  async update(req, res) {
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
      const updatedCompany = await prisma.company.update({ where: { id }, data })
      return res.status(200).json({ data: updatedCompany })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return res.status(404).json(prismaNotFound('Company'))
      }
      throw error
    }
  }
})

export const getCompanies = ctrl.getAll
export const getCompanyById = ctrl.getById
export const createCompany = ctrl.create
export const updateCompanyById = ctrl.update
export const deleteCompanyById = ctrl.delete
