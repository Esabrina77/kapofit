import { PrismaClient } from '@prisma/client'
import { CreateWorkoutDTO, WorkoutResponse, UpdateWorkoutDTO, FullWorkoutDTO, WorkoutDTO } from '../types/workout.types'

export class WorkoutService {
  private prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    // Utilise le prisma injecté ou crée une nouvelle instance
    this.prisma = prisma || new PrismaClient()
  }

  // Créer un nouveau workout
  async createWorkout(data: CreateWorkoutDTO): Promise<WorkoutResponse> {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { firebaseId: data.userId }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Créer le workout avec l'ID de l'utilisateur
      const workout = await this.prisma.workout.create({
        data: {
          userId: user.id,  // Utiliser l'ID de l'utilisateur de la base de données
          type: data.type,
          duration: 0,  // Ajout de la durée par défaut
          exercises: {
            create: data.exercises
          }
        },
        include: {
          exercises: true
        }
      });

      return { ...workout, createdAt: workout.date };
    } catch (error) {
      console.error('Erreur création workout:', error);
      throw error;
    }
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
  async completeWorkout(id: string, duration: number): Promise<WorkoutResponse> {
    const workout = await this.prisma.workout.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        duration
      },
      include: {
        exercises: true
      }
    })

    return {
      ...workout,
      createdAt: workout.date,
      exercises: workout.exercises
    }
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
    // Utiliser une transaction pour supprimer les exercices et le workout
    await this.prisma.$transaction([
      // D'abord supprimer tous les exercices liés
      this.prisma.exercise.deleteMany({
        where: { workoutId: id }
      }),
      // Ensuite supprimer le workout
      this.prisma.workout.delete({
        where: { id }
      })
    ])
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
