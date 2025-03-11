import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { userSchema, workoutSchema } from '../schemas/validation.schemas';

/**
 * Middleware de validation générique
 */
const validate = (schema: z.ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ error: 'Données invalides' });
  }
};

// Middlewares spécifiques
export const validateUser = validate(userSchema);
export const validateWorkout = validate(workoutSchema); 