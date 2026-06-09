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

export const updateInterview = (id, data) => {
  const interview = interviews.find((item) => item.id === id)

  if (!interview) {
    throw new ApiError(404, 'Interview not found')
  }

  if (data.applicationId !== undefined) {
    interview.applicationId = data.applicationId
  }

  if (data.date !== undefined) {
    interview.date = data.date
  }

  if (data.stage !== undefined) {
    interview.stage = data.stage
  }

  if (data.notes !== undefined) {
    interview.notes = data.notes || ''
  }

  return interview
}

export const deleteInterview = (id) => {
  const index = interviews.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new ApiError(404, 'Interview not found')
  }

  const deletedInterview = interviews[index]
  interviews.splice(index, 1)

  return deletedInterview
}
