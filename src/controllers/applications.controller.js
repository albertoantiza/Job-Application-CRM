import prisma from '../config/prisma.js'

export const testDb = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      take: 1
    })

    return res.json({
      ok: true,
      count: applications.length
    })
  } catch (error) {
    console.error('testDb failed:', error)
    return res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    })
  }
}

export const getApplications = async (req, res) => {
  const applications = await prisma.application.findMany({
    orderBy: { id: 'asc' }
  })

  return res.status(200).json(applications)
}

export const getApplicationById = async (req, res) => {
  const id = Number(req.params.id)

  const application = await prisma.application.findUnique({
    where: { id }
  })

  if (!application) {
    return res.status(404).json({ error: 'Application not found' })
  }

  return res.status(200).json(application)
}

export const createApplication = async (req, res) => {
  const { companyId, role, status } = req.body

  const newApplication = await prisma.application.create({
    data: {
      companyId: companyId ?? null,
      role,
      status: status || 'applied'
    }
  })

  return res.status(201).json(newApplication)
}

export const updateApplicationById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...req.body,
        companyId: req.body.companyId ?? undefined
      }
    })

    return res.status(200).json(updatedApplication)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' })
    }

    throw error
  }
}

export const deleteApplicationById = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const deletedApplication = await prisma.application.delete({
      where: { id }
    })

    return res.status(200).json({
      message: 'Application deleted successfully',
      data: deletedApplication
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' })
    }

    throw error
  }
}
