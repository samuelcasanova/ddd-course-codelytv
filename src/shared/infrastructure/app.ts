import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from './errorHandler'
import { videoRouter } from '../../video/infrastructure/videoRouter'

export const app = express()

app.use(json())
app.use('/api/videos', videoRouter)

app.use(errorHandler)
