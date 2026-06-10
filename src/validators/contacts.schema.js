export const createContactSchema = {
  body: {
    name: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string',
      format: 'email'
    },
    companyId: {
      required: false,
      type: 'number'
    }
  }
}

export const updateContactSchema = {
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
    email: {
      required: false,
      type: 'string',
      format: 'email'
    },
    companyId: {
      required: false,
      type: 'number'
    }
  }
}

export const contactIdSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  }
}
