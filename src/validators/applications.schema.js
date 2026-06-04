export const createApplicationSchema = {
  body: {
    company: {
      required: true,
      type: 'string'
    },
    role: {
      required: true,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string'
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
    company: {
      required: false,
      type: 'string'
    },
    role: {
      required: false,
      type: 'string'
    },
    status: {
      required: false,
      type: 'string'
    }
  }
}

export const applicationIdSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  }
}
