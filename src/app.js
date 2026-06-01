import express from 'express'
import jobsRoutes from './routes/jobs.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/jobs', jobsRoutes)

app.use(errorHandler)

export default app
