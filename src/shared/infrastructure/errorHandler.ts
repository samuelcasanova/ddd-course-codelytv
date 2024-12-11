import { type Request, type Response, type NextFunction } from 'express'

const errorMap: Record<string, number> = {
  NotFoundError: 404
}
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error)
  const statusCode = getHttpStatusCode((error as any).prototype?.constructor?.name)
  res.status(statusCode).send({ error })
}

function getHttpStatusCode (error: string): number {
  return errorMap[error] ?? 400
}
