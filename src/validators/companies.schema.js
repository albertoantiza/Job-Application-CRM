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
    }
  }
}

export const companyIdSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  }
}
