import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError } from '../utils/errors.js'
import { parsePagination, parseSort, buildPaginatedResponse } from '../utils/pagination.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const ALLOWED_SORT = ['id', 'name', 'website', 'location', 'createdAt', 'updatedAt']

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
    const pagination = parsePagination(req.query)
    const orderBy = parseSort(req.query, ALLOWED_SORT, { id: 'asc' })
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: Object.keys(where).length ? where : undefined,
        ...pagination,
        orderBy
      }),
      prisma.company.count({ where: Object.keys(where).length ? where : undefined })
    ])
    const response = buildPaginatedResponse(companies, pagination, total)
    logger.info(`Company list returned ${companies.length} results`)
    return res.status(200).json(response)
  },
  async create(req, res) {
    const { name, website, location } = req.body
    try {
      const newCompany = await prisma.company.create({
        data: { name, website: website || null, location: location || null }
      })
      logger.info(`Company ${newCompany.id} created — name="${name}"`)
      return res.status(201).json({ data: newCompany })
    } catch (error) {
      throw new BadRequestError('Could not create company', {
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
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: name, website, location'
      })
    }
    try {
      const updatedCompany = await prisma.company.update({ where: { id }, data })
      logger.info(`Company ${id} updated`)
      return res.status(200).json({ data: updatedCompany })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        logger.warn(`Company ${id} not found — update`)
        throwPrismaNotFound('Company')
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
