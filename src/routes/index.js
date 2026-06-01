import { Router } from 'express'
import {
  getJobs,
  getJobById,
  createJob
} from '../controllers/jobs.controller.js'

const router = Router()

router.get('/', getJobs)
router.get('/:id', getJobById)
router.post('/', createJob)

export default router
