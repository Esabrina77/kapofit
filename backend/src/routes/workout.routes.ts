import { Router } from 'express'
import { WorkoutController } from '../controllers/workout.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validateWorkout } from '../middleware/validation.middleware'

const router = Router()
const workoutController = new WorkoutController()

// Protéger toutes les routes avec l'authentification
router.use(authMiddleware)

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'exercice
 *         sets:
 *           type: integer
 *           description: Nombre de séries
 *         reps:
 *           type: integer
 *           description: Nombre de répétitions
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du workout
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur
 *         type:
 *           type: string
 *           enum: [SOLO, GROUP]
 *         status:
 *           type: string
 *           enum: [IN_PROGRESS, COMPLETED]
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 */

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Crée un nouveau workout
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - exercises
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [SOLO, GROUP]
 *               exercises:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Exercise'
 *     responses:
 *       201:
 *         description: Workout créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 */
router.post('/', validateWorkout, workoutController.createWorkout)

/**
 * @swagger
 * /api/workouts/{userId}:
 *   get:
 *     summary: Récupère tous les workouts d'un utilisateur
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 */
router.get('/:userId', workoutController.getUserWorkouts)
router.get('/detail/:id', workoutController.getWorkoutById)

// UPDATE
router.put('/:id', workoutController.updateFullWorkout)     // Mise à jour complète
router.patch('/:id', workoutController.updatePartialWorkout) // Mise à jour partielle
router.patch('/:id/complete', workoutController.completeWorkout) // Cas spécifique

// DELETE
router.delete('/:id', workoutController.deleteWorkout)

export default router
