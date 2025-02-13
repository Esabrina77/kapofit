import { WorkoutService } from '../services/workout.service'
import { PrismaClient } from '@prisma/client'

// On mock (simule) Prisma pour ne pas utiliser une vraie base de données
jest.mock('@prisma/client')

// On crée un faux objet Prisma avec toutes les méthodes dont on a besoin
const mockPrisma = {
  workout: {
    create: jest.fn(),      // jest.fn() crée une fonction mock qu'on peut surveiller
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  exercise: {
    deleteMany: jest.fn()
  },
  $transaction: jest.fn()    // Pour les opérations qui nécessitent plusieurs actions
}

// Groupe principal de tests pour WorkoutService
describe('WorkoutService', () => {
  let workoutService: WorkoutService

  beforeEach(() => {
    jest.clearAllMocks()
    // Injecter notre mockPrisma dans le service
    workoutService = new WorkoutService(mockPrisma as unknown as PrismaClient)
  })

  // Groupe de tests pour la méthode createWorkout
  describe('createWorkout', () => {
    it('should create a workout with exercises', async () => {
      // ARRANGE : On prépare les données de test
      const mockWorkout = {
        id: '123',
        userId: 'user123',
        type: 'SOLO',
        date: new Date(),
        duration: 0,
        status: 'IN_PROGRESS',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 10 }
        ]
      }

      // On configure le mock pour qu'il retourne notre workout de test
      mockPrisma.workout.create.mockResolvedValue(mockWorkout)

      // ACT : On exécute la fonction qu'on veut tester
      const result = await workoutService.createWorkout({
        userId: 'user123',
        type: 'SOLO',
        exercises: [{ name: 'Push-ups', sets: 3, reps: 10 }]
      })

      // ASSERT : On vérifie que tout s'est passé comme prévu
      expect(result).toHaveProperty('id', '123')  // Le workout a bien un ID
      expect(result.exercises).toHaveLength(1)    // Il contient bien un exercice
      expect(mockPrisma.workout.create).toHaveBeenCalled()  // La création a été appelée
    })
  })

  // Groupe de tests pour la méthode deleteWorkout
  describe('deleteWorkout', () => {
    it('should delete a workout and its exercises', async () => {
      // ARRANGE : On configure le mock pour la transaction
      mockPrisma.$transaction.mockResolvedValue([])

      // ACT : On exécute la suppression
      await workoutService.deleteWorkout('123')

      // ASSERT : On vérifie que les bonnes fonctions ont été appelées
      expect(mockPrisma.$transaction).toHaveBeenCalled()  // Une transaction a eu lieu
      expect(mockPrisma.exercise.deleteMany).toHaveBeenCalledWith({
        where: { workoutId: '123' }  // Les exercices ont été supprimés
      })
    })
  })

  // Test pour getUserWorkouts
  describe('getUserWorkouts', () => {
    it('should get all workouts for a user', async () => {
      // ARRANGE
      const mockWorkouts = [
        {
          id: '123',
          userId: 'user123',
          date: new Date(),
          duration: 0,
          type: 'SOLO',
          status: 'IN_PROGRESS',
          exercises: []
        }
      ]
      mockPrisma.workout.findMany.mockResolvedValue(mockWorkouts) // On simule le retour de la fonction findMany

      // ACT
      const result = await workoutService.getUserWorkouts('user123')

      // ASSERT
      expect(result).toHaveLength(1)
      expect(mockPrisma.workout.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        include: { exercises: true },
        orderBy: { date: 'desc' }
      })
    })
  })

  // Test pour getWorkoutById
  describe('getWorkoutById', () => {
    it('should get a specific workout', async () => {
      // ARRANGE
      const mockWorkout = {
        id: '123',
        userId: 'user123',
        date: new Date(),
        duration: 0,
        type: 'SOLO',
        status: 'IN_PROGRESS',
        exercises: []
      }
      mockPrisma.workout.findUnique.mockResolvedValue(mockWorkout)

      // ACT
      const result = await workoutService.getWorkoutById('123')

      // ASSERT
      expect(result).toHaveProperty('id', '123')
      expect(mockPrisma.workout.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: { exercises: true }
      })
    })
  })

  // Tests des cas d'erreur
  describe('error cases', () => {
    it('should handle workout not found', async () => {
      // ARRANGE
      mockPrisma.workout.findUnique.mockResolvedValue(null)

      // ACT & ASSERT
      await expect(
        workoutService.getWorkoutById('nonexistent')
      ).resolves.toBeNull()
    })

    it('should handle deletion of non-existent workout', async () => {
      // ARRANGE
      mockPrisma.$transaction.mockRejectedValue(new Error('Workout not found'))

      // ACT & ASSERT
      await expect(
        workoutService.deleteWorkout('nonexistent')
      ).rejects.toThrow('Workout not found')
    })

    it('should handle invalid workout update', async () => {
      // ARRANGE
      mockPrisma.workout.update.mockRejectedValue(
        new Error('Invalid workout data')
      )

      // ACT & ASSERT
      await expect(
        workoutService.updateFullWorkout('123', {
          type: 'INVALID',
          status: 'INVALID',
          duration: -1,
          exercises: []
        })
      ).rejects.toThrow('Invalid workout data')
    })
  })
}) 