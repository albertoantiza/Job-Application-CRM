import express from 'express'
import routes from './routes/index.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
