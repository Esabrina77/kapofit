import { z } from 'zod';

// Schéma User
export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  firebaseId: z.string().optional(),
  imageUrl: z.string().url().optional()
});

// Schéma Exercise
export const exerciseSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  sets: z.number().min(1, 'Minimum 1 série'),
  reps: z.number().min(1, 'Minimum 1 répétition')
});

// Schéma Workout
export const workoutSchema = z.object({
  userId: z.string(),
  type: z.enum(['SOLO', 'DUO']),
  exercises: z.array(exerciseSchema).min(1, 'Au moins un exercice requis')
});

// Types inférés
export type UserInput = z.infer<typeof userSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>; 