import { ENTITY_STATUSES } from '../utils/constants.js'

export const createCompanySchema = {
  body: {
    name: {
      required: true,
      type: 'string'
    },
    website: {
      required: false,
      type: 'string'
    },
    location: {
      required: false,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string',
      enum: ENTITY_STATUSES
    }
  }
}

export const updateCompanySchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  },
  body: {
    name: {
      required: false,
      type: 'string'
    },
    website: {
      required: false,
      type: 'string'
    },
    location: {
      required: false,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string',
      enum: ENTITY_STATUSES
    }
  }
}
