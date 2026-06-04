export const createInterviewSchema = {
  body: {
    applicationId: {
      required: true,
      type: 'number'
    },
    date: {
      required: true,
      type: 'string'
    },
    stage: {
      required: true,
      type: 'string'
    },
    notes: {
      required: false,
      type: 'string'
    }
  }
}

export const interviewIdSchema = {
  params: {
    id: {
      required: true,
      type: 'number'
    }
  }
}
