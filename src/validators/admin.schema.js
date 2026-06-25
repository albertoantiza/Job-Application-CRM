export const updateRoleSchema = {
  body: {
    role: {
      required: true,
      type: 'string',
      enum: ['user', 'admin']
    }
  }
}
