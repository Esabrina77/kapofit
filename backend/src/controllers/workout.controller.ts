import { Request, Response } from 'express'
import { WorkoutService } from '../services/workout.service'
import { FullWorkoutDTO, WorkoutDTO } from '../types/workout.types'

const workoutService = new WorkoutService()

export class WorkoutController {
  // POST /workouts
  async createWorkout(req: Request, res: Response) {
    try {
      const data = req.body

      // Validation des données requises
      if (!data.userId || !data.type || data.type.trim() === '') {
        return res.status(400).json({ 
          error: "Les champs userId et type sont requis et ne peuvent pas être vides" 
        })
      }

      const workout = await workoutService.createWorkout(data.userId, {
        type: data.type,
        duration: data.duration || 0
      })

      return res.status(201).json(workout)
    } catch (error) {
      console.error('❌ Error creating workout:', error)
      return res.status(500).json({ error: "Erreur lors de la création du workout" })
    }
  }

  // GET /workouts/user/:userId
  async getUserWorkouts(req: Request, res: Response) {
    try {
      const { userId } = req.params
      const workouts = await workoutService.getUserWorkouts(userId)
      res.json(workouts)
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des workouts" })
    }
  }

  // PATCH /workouts/:id/complete
  async completeWorkout(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { duration } = req.body
      const workout = await workoutService.completeWorkout(id, duration)
      res.json(workout)
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la complétion du workout" })
    }
  }

  // GET /workouts/:id
  async getWorkoutById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const workout = await workoutService.getWorkoutById(id)
      
      if (!workout) {
        return res.status(404).json({ error: "Workout non trouvé" })
      }

      return res.json(workout)
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la récupération du workout" })
    }
  }

  // PUT - Mise à jour complète
  async updateFullWorkout(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body as FullWorkoutDTO

      // Validation des données requises
      if (!data.type || !data.status || !Array.isArray(data.exercises)) {
        return res.status(400).json({ 
          error: "Les champs type, status et exercises sont requis" 
        })
      }

      // Validation des exercices
      if (!data.exercises.every((e: any) => e.name && e.sets > 0 && e.reps > 0)) {
        return res.status(400).json({ 
          error: "Chaque exercice doit avoir un nom et des valeurs positives" 
        })
      }

      const workout = await workoutService.updateFullWorkout(id, data)
      return res.json(workout)
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la mise à jour complète du workout" })
    }
  }

  // PATCH - Mise à jour partielle
  async updatePartialWorkout(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body as Partial<WorkoutDTO>

      // Validation des exercices si présents
      if (data.exercises && !data.exercises.every((e: any) => 
        e.id && e.name && e.sets > 0 && e.reps > 0
      )) {
        return res.status(400).json({ 
          error: "Format d'exercice invalide" 
        })
      }

      const workout = await workoutService.updatePartialWorkout(id, data)
      return res.json(workout)
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la mise à jour partielle du workout" })
    }
  }

  async deleteWorkout(req: Request, res: Response) {
    try {
      const { id } = req.params
      await workoutService.deleteWorkout(id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du workout" })
    }
  }
}
