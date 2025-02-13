import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser } from '../middleware/validation.middleware';

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

router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);

export default router;
