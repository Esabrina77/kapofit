import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - firebaseId
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               firebaseId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 */
router.post('/', validateUser, userController.createUser);

router.post('/verify', userController.verifyUser);

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

router.post('/sync-firebase', userController.syncFirebaseUser);
router.post('/:id/sync-stats', authMiddleware, userController.syncUserStats);

router.post('/sync', authMiddleware, userController.syncFirebaseUser);

export default router;
