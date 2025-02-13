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
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Middlewares spécifiques
export const validateUser = validate(userSchema);
export const validateWorkout = validate(workoutSchema); 