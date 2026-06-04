export const createNoteSchema = {
  body: {
    applicationId: {
      required: true,
      type: 'number'
    },
    content: {
      required: true,
      type: 'string'
    }
  }
}

export const noteIdSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  }
}
