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

export const updateNoteSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  },
  body: {
    applicationId: {
      required: false,
      type: 'number'
    },
    content: {
      required: false,
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
