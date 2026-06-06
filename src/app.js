import express from 'express'
import pool from './config/db.js'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

dotenv.config()

const app = express()

app.use(express.json())

console.log('Loading routes...')

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
