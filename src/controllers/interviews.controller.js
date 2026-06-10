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

  try {
    const newInterview = await prisma.interview.create({
      data: {
        date: new Date(date),
        stage,
        notes: notes || null,
        application: {
          connect: { id: Number(applicationId) }
        }
      }
    })

    return res.status(201).json(newInterview)
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid applicationId',
        details: 'The related application does not exist'
      })
    }

    return res.status(400).json({
      error: 'Could not create interview',
      details: error.message
    })
  }
}

export const updateInterviewById = async (req, res) => {
  const id = Number(req.params.id)
  const { applicationId, date, notes, ...rest } = req.body

  try {
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        ...rest,
        ...(date === undefined ? {} : { date: new Date(date) }),
        ...(notes === undefined ? {} : { notes }),
        ...(applicationId === undefined
          ? {}
          : applicationId === null
            ? {}
            : { application: { connect: { id: Number(applicationId) } } })
      }
    })

    return res.status(200).json(updatedInterview)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Interview not found' })
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid applicationId',
        details: 'The related application does not exist'
      })
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
