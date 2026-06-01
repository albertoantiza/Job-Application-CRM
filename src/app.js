import express from 'express'
import index from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/jobs', index)

app.use(errorHandler)

export default app
