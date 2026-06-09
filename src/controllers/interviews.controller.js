import prisma from '../config/prisma.js'

export const getInterviews = async (req, res) => {
  const interviews = await prisma.interview.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json(interviews)
}

export const getInterviewById = async (req, res) => {
  const id = Number(req.params.id)

  const interview = await prisma.interview.findUnique({
    where: { id }
  })

  if (!interview) {
    return res.status(404).json({ error: 'Interview not found' })
  }

  return res.status(200).json(interview)
}

export const createInterview = async (req, res) => {
  const { applicationId, date, stage, notes } = req.body

  const newInterview = await prisma.interview.create({
    data: {
      applicationId,
      date: new Date(date),
      stage,
      notes: notes || null
    }
  })

  return res.status(201).json(newInterview)
}

export const updateInterviewById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
        notes: req.body.notes ?? undefined
      }
    })

    return res.status(200).json(updatedInterview)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Interview not found' })
    }

    throw error
  }
}

export const deleteInterviewById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedInterview = await prisma.interview.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Interview deleted successfully',
      data: deletedInterview
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Interview not found' })
    }

    throw error
  }
}
