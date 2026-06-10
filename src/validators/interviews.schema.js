export const createInterviewSchema = {
  body: {
    applicationId: {
      required: true,
      type: 'number'
    },
    date: {
      required: true,
      type: 'string',
      format: 'date'
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

export const updateInterviewSchema = {
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
    date: {
      required: false,
      type: 'string',
      format: 'date'
    },
    stage: {
      required: false,
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
