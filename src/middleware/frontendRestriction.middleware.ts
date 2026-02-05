import { Request, Response, NextFunction } from 'express';

export function frontendSecretOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'production') return next(); // bypass in dev

  const frontendSecret = process.env.FRONTEND_SECRET;

  if (req.headers['x-frontend-secret'] !== frontendSecret) {
    return res
      .status(403)
      .json({ message: 'Access forbidden: invalid frontend secret' });
  }

  next();
}
