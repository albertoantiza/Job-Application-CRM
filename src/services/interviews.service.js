import { interviews } from '../repositories/interviews.repository.js'
import ApiError from '../utils/ApiError.js'

export const getAllInterviews = () => {
  return interviews
}

export const findInterviewById = (id) => {
  const interview = interviews.find((item) => item.id === id)

  if (!interview) {
    throw new ApiError(404, 'Interview not found')
  }

  return interview
}

export const addInterview = ({ applicationId, date, stage, notes }) => {
  const newInterview = {
    id: interviews.length + 1,
    applicationId,
    date,
    stage,
    notes: notes || ''
  }

  interviews.push(newInterview)

  return newInterview
}
