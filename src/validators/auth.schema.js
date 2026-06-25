export const registerSchema = {
  body: {
    email: {
      required: true,
      type: 'string',
      format: 'email'
    },
    password: {
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 32
    },
    name: {
      required: false,
      type: 'string'
    },
    role: {
      required: false,
      type: 'string',
      enum: ['user', 'admin']
    }
  }
}

export const loginSchema = {
  body: {
    email: {
      required: true,
      type: 'string'
    },
    password: {
      required: true,
      type: 'string'
    }
  }
}
