import express from 'express'
import applicationsRoutes from './routes/applications.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/applications', applicationsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
