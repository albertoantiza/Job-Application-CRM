import { contactService } from '../services/contact.service.js'
import { BadRequestError } from '../utils/errors.js'
import { parsePagination, parseSort, formatPaginatedResponse } from '../utils/pagination.js'
import { parseSearch } from '../utils/search.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const SEARCHABLE_FIELDS = ['name', 'email', 'status']
const ALLOWED_SORT = ['id', 'name', 'email', 'status', 'companyId', 'createdAt', 'updatedAt']

const ctrl = createEntityController('Contact', contactService, {
  async getAll(req, res) {
    const { companyId, status } = req.query
    const where = {
      ...parseSearch(req.query, SEARCHABLE_FIELDS)
    }
    if (companyId) where.companyId = Number(companyId)
    if (status) where.status = String(status)
    const pagination = parsePagination(req.query)
    const orderBy = parseSort(req.query, ALLOWED_SORT, { id: 'asc' })
    const { entities, total } = await contactService.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy,
      ...pagination
    })
    const response = formatPaginatedResponse(entities, pagination, total)
    logger.info(`Contact list returned ${entities.length} results`)
    return res.status(200).json(response)
  },
  async create(req, res) {
    const newContact = await contactService.create(req.body)
    logger.info(`Contact ${newContact.id} created — name="${req.body.name}"`)
    return res.status(201).json({ data: newContact })
  },
  async update(req, res) {
    const id = Number(req.params.id)
    const { companyId, status, ...rest } = req.body
    const data = { ...rest }
    if (status !== undefined) data.status = status
    if (companyId === undefined && !Object.keys(data).length) {
      throw new BadRequestError('No fields to update', {
        details: 'Send at least one of: name, email, companyId, status'
      })
    }
    const updatedContact = await contactService.update(id, { ...data, companyId })
    logger.info(`Contact ${id} updated`)
    return res.status(200).json({ data: updatedContact })
  }
}, { searchableFields: SEARCHABLE_FIELDS })

export const getContacts = ctrl.getAll
export const getContactById = ctrl.getById
export const createContact = ctrl.create
export const updateContactById = ctrl.update
export const deleteContactById = ctrl.delete
