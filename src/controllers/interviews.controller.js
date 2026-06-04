import {
  getAllInterviews,
  findInterviewById,
  addInterview
} from '../services/interviews.service.js'

export const getInterviews = (req, res) => {
  const interviews = getAllInterviews()
  return res.status(200).json(interviews)
}

export const getInterviewById = (req, res) => {
  const id = Number(req.params.id)
  const interview = findInterviewById(id)

  return res.status(200).json(interview)
}

export const createInterview = (req, res) => {
  const newInterview = addInterview(req.body)
  return res.status(201).json(newInterview)
}
