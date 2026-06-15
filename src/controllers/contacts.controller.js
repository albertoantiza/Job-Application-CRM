import prisma from '../config/prisma.js'
import { isPrismaError, throwPrismaConflict, throwPrismaNotFound } from '../utils/prismaError.js'
import { BadRequestError } from '../utils/errors.js'
import { parsePagination, parseSort, buildPaginatedResponse } from '../utils/pagination.js'
import { parseSearch } from '../utils/search.js'
import { logger } from '../utils/logger.js'
import { createEntityController } from './factory.js'

const SEARCHABLE_FIELDS = ['name', 'email', 'status']
const ALLOWED_SORT = ['id', 'name', 'email', 'status', 'companyId', 'createdAt', 'updatedAt']

const ctrl = createEntityController('contact', 'Contact', {
  async getAll(req, res) {
    const { companyId, status } = req.query
    const where = {
      ...parseSearch(req.query, SEARCHABLE_FIELDS)
    }
    if (companyId) where.companyId = Number(companyId)
    if (status) where.status = String(status)
    const pagination = parsePagination(req.query)
    const orderBy = parseSort(req.query, ALLOWED_SORT, { id: 'asc' })
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: Object.keys(where).length ? where : undefined,
        ...pagination,
        orderBy
      }),
      prisma.contact.count({ where: Object.keys(where).length ? where : undefined })
    ])
    const response = buildPaginatedResponse(contacts, pagination, total)
    logger.info(`Contact list returned ${contacts.length} results`)
    return res.status(200).json(response)
  },
  async create(req, res) {
    const { name, email, companyId, status } = req.body
    try {
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          status: status || 'active',
          ...(companyId ? { company: { connect: { id: Number(companyId) } } } : {})
        }
      })
      logger.info(`Contact ${newContact.id} created — name="${name}"`)
      return res.status(201).json({ data: newContact })
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throwPrismaConflict('companyId', 'company')
      }
      throw new BadRequestError('Could not create contact', {
        details: error.message
      })
    }
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
    try {
      const updatedContact = await prisma.contact.update({
        where: { id },
        data: {
          ...(companyId === undefined
            ? {}
            : companyId === null
              ? { company: { disconnect: true } }
              : { company: { connect: { id: Number(companyId) } } }),
          ...data
        }
      })
      logger.info(`Contact ${id} updated`)
      return res.status(200).json({ data: updatedContact })
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        logger.warn(`Contact ${id} not found — update`)
        throwPrismaNotFound('Contact')
      }
      throw error
    }
  }
})

export const getContacts = ctrl.getAll
export const getContactById = ctrl.getById
export const createContact = ctrl.create
export const updateContactById = ctrl.update
export const deleteContactById = ctrl.delete
