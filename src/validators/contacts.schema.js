export const createContactSchema = {
  body: {
    name: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
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
