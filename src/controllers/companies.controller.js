import { companyService } from '../services/company.service.js'
import { BadRequestError } from '../utils/errors.js'
import { parsePagination, parseSort, formatPaginatedResponse } from '../utils/pagination.js'
import { parseSearch } from '../utils/search.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const SEARCHABLE_FIELDS = ['name', 'website', 'location', 'status']
const ALLOWED_SORT = ['id', 'name', 'website', 'location', 'status', 'createdAt', 'updatedAt']

const ctrl = createEntityController('Company', companyService, {
  async getAll(req, res) {
    const { location, status } = req.query
    const where = {
      ...parseSearch(req.query, SEARCHABLE_FIELDS)
    }
    if (location) {
      where.location = { contains: String(location), mode: 'insensitive' }
    }
    if (status) where.status = String(status)
    const pagination = parsePagination(req.query)
    const orderBy = parseSort(req.query, ALLOWED_SORT, { id: 'asc' })
    const { entities, total } = await companyService.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy,
      ...pagination
    })
    const response = formatPaginatedResponse(entities, pagination, total)
    logger.info(`Company list returned ${entities.length} results`)
    return res.status(200).json(response)
  },
  async create(req, res) {
    const newCompany = await companyService.create(req.body)
    logger.info(`Company ${newCompany.id} created — name="${req.body.name}"`)
    return res.status(201).json({ data: newCompany })
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { name, website, location, status } = req.body
    const data = {}
    if (name !== undefined) data.name = name
    if (website !== undefined) data.website = website
    if (location !== undefined) data.location = location
    if (status !== undefined) data.status = status
    if (!Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: name, website, location, status'
      })
    }
    const updatedCompany = await companyService.update(id, data)
    logger.info(`Company ${id} updated`)
    return res.status(200).json({ data: updatedCompany })
  }
}, { searchableFields: SEARCHABLE_FIELDS })

export const getCompanies = ctrl.getAll
export const getCompanyById = ctrl.getById
export const createCompany = ctrl.create
export const updateCompanyById = ctrl.update
export const deleteCompanyById = ctrl.delete
