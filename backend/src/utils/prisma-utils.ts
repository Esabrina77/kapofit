import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE - Créer un nouvel utilisateur avec ses données de base
export async function createUser(userData: {
  email: string
  firstName: string
  lastName: string
  firebaseId: string
}) {
  return prisma.user.create({
    data: {
      ...userData,
      // Créer automatiquement les stats
      stats: {
        create: {
          totalWorkouts: 0,
          totalTime: 0,
          points: 0,
          level: 1
        }
      }
    },
    include: {
      bodyInfo: true,
      stats: true,
      workouts: {
        include: {
          exercises: true
        }
      }
    }
  })
}

// READ - Récupérer un utilisateur avec toutes ses données
export async function getUserWithAll(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      bodyInfo: true,
      stats: true,
      workouts: {
        include: {
          exercises: true
        }
      }
    }
  })
}

// UPDATE - Mettre à jour les stats après un workout
export async function updateUserStats(userId: string, workoutDuration: number) {
  return prisma.stats.update({
    where: { userId },
    data: {
      totalWorkouts: { increment: 1 },
      totalTime: { increment: workoutDuration },
      points: { increment: Math.floor(workoutDuration / 60) } // 1 point par minute
    }
  })
}

// DELETE - Supprimer un utilisateur et toutes ses données
export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId }
  })
}

// 1. Fonctions pour les workouts
export async function createWorkout(data: {
  userId: string
  duration: number
  type: 'SOLO' | 'DUO'
  exercises: Array<{
    name: string
    sets: number
    reps: number
    score?: number
  }>
}) {
  return prisma.workout.create({
    data: {
      userId: data.userId,
      duration: data.duration,
      type: data.type,
      status: 'COMPLETED',
      exercises: {
        create: data.exercises
      }
    },
    include: {
      exercises: true
    }
  })
}

// 2. Fonctions pour bodyInfo
export async function updateBodyInfo(data: {
  userId: string
  height?: number
  weight?: number
  goals?: string[]
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}) {
  return prisma.bodyInfo.upsert({
    where: {
      userId: data.userId
    },
    update: {
      ...data
    },
    create: {
      userId: data.userId,
      height: data.height,
      weight: data.weight,
      goals: data.goals || [],
      level: data.level || 'BEGINNER'
    }
  })
} 