import type express from 'express'

export interface Router {
  path: string
  getRouter: () => express.Router
}
