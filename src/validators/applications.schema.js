export const createApplicationSchema = {
  body: {
    company: {
      required: true,
      type: 'string'
    },
    role: {
      required: true,
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
