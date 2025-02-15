import { PrismaClient, Workout } from '@prisma/client'
import { WorkoutResponse, UpdateWorkoutDTO, FullWorkoutDTO, WorkoutDTO } from '../types/workout.types'

export class WorkoutService {
  private prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    // Utilise le prisma injecté ou crée une nouvelle instance
    this.prisma = prisma || new PrismaClient()
  }

  // Créer un nouveau workout
  async createWorkout(userId: string, data: {
    type: string;
    duration: number;
  }): Promise<Workout> {
    return this.prisma.$transaction(async (tx) => {
      // Créer le workout
      const workout = await tx.workout.create({
        data: {
          userId,
          type: data.type,
          duration: data.duration,
          status: 'IN_PROGRESS',
          date: new Date(),
        }
      });

      // Calculer le nombre total de workouts
      const totalWorkouts = await tx.workout.count({
        where: { userId }
      });

      // Mettre à jour les stats avec le nombre réel de workouts
      await tx.stats.update({
        where: { userId },
        data: {
          totalWorkouts: totalWorkouts,
          totalTime: { increment: data.duration },
          points: { increment: 10 }
        }
      });

      return workout;
    });
  }

  // Récupérer les workouts d'un utilisateur
  async getUserWorkouts(userId: string): Promise<WorkoutResponse[]> {
    const workouts = await this.prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return workouts.map(workout => ({
      ...workout,
      createdAt: workout.date  // Convertit 'date' en 'createdAt'
    }))
  }

  // Mettre à jour le status et la durée
  async completeWorkout(id: string, duration: number): Promise<Workout> {
    return this.prisma.$transaction(async (tx) => {
      const workout = await tx.workout.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          duration
        }
      });

      // Mettre à jour le temps total dans les stats
      await tx.stats.update({
        where: { userId: workout.userId },
        data: {
          totalTime: { increment: duration },
          points: { increment: 50 } // Points bonus pour complétion
        }
      });

      return workout;
    });
  }

  // Nouveau
  async getWorkoutById(id: string): Promise<WorkoutResponse | null> {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: { exercises: true }
    })
    
    return workout ? { ...workout, createdAt: workout.date } : null
  }

  async updateWorkout(id: string, data: UpdateWorkoutDTO): Promise<WorkoutResponse> {
    const workout = await this.prisma.workout.update({
      where: { id },
      data: {
        type: data.type,
        exercises: {
          updateMany: data.exercises.map(exercise => ({
            where: { id: exercise.id },
            data: {
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps
            }
          }))
        }
      },
      include: { exercises: true }
      })

    return {
      ...workout,
      createdAt: workout.date,
      exercises: workout.exercises
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      // Récupérer le workout avant de le supprimer
      const workout = await tx.workout.findUnique({
        where: { id }
      });

      if (!workout) {
        throw new Error('Workout non trouvé');
      }

      // Supprimer le workout
      await tx.workout.delete({
        where: { id }
      });

      // Recalculer les stats
      const totalWorkouts = await tx.workout.count({
        where: { userId: workout.userId }
      });

      // Mettre à jour les stats
      await tx.stats.update({
        where: { userId: workout.userId },
        data: {
          totalWorkouts,
          totalTime: { decrement: workout.duration },
          points: { decrement: 10 }
        }
      });
    });
  }

  // PUT - Mise à jour complète
  async updateFullWorkout(id: string, data: FullWorkoutDTO): Promise<WorkoutResponse> {
    const workout = await this.prisma.workout.update({
      where: { id },
      data: {
        type: data.type,
        status: data.status,
        duration: data.duration,
        exercises: {
          deleteMany: {},  // Supprime tous les exercices existants
          create: data.exercises  // Crée les nouveaux exercices
        }
      },
      include: { exercises: true }
    })
    return { ...workout, createdAt: workout.date, exercises: workout.exercises }
  }

  // PATCH - Mise à jour partielle
  async updatePartialWorkout(id: string, data: Partial<WorkoutDTO>): Promise<WorkoutResponse> {
    const workout = await this.prisma.workout.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status }),
        ...(data.duration && { duration: data.duration }),
        ...(data.exercises && {
          exercises: {
            updateMany: data.exercises.map(exercise => ({
              where: { id: exercise.id },
              data: {
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps
              }
            }))
          }
        })
      },
      include: { exercises: true }
    })
    return { ...workout, createdAt: workout.date, exercises: workout.exercises }
  }
}
