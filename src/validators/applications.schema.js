import { APPLICATION_STATUSES } from '../utils/constants.js'

export const createApplicationSchema = {
  body: {
    companyId: {
      required: false,
      type: 'number'
    },
    role: {
      required: true,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string',
      enum: APPLICATION_STATUSES
    }
  }
}

export const updateApplicationSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  },
  body: {
    companyId: {
      required: false,
      type: 'number'
    },
    role: {
      required: false,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string',
      enum: APPLICATION_STATUSES
    }
  }
}
