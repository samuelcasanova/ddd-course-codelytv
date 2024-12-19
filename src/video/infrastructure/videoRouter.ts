import express from 'express'
import { getVideoController } from './getVideoController'
import { postVideoController } from './postVideoController'

export const videoRouter = express.Router()

videoRouter.get('/', getVideoController)

videoRouter.post('/', postVideoController)
