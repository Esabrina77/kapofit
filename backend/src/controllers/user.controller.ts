import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { PrismaClient } from '@prisma/client';

export class UserController {
  private userService: UserService;
  private prisma: PrismaClient;

  constructor() {
    this.userService = new UserService();
    this.prisma = new PrismaClient();
  }

  createUser = async (req: Request, res: Response) => {
    try {
      console.log('Données reçues:', req.body); // Debug
      
      const { email, firstName, lastName, password, imageUrl } = req.body;
      
      if (!password) {
        throw new Error('Le mot de passe est requis');
      }

      const user = await this.userService.createUser({
        email,
        firstName,
        lastName,
        password,  // S'assurer que le mot de passe est transmis
        imageUrl
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Erreur controller:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erreur création utilisateur' 
      });
    }
  }

  verifyUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.verifyPassword(email, password);
      
      const userWithDetails = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
          stats: true,
          bodyInfo: true
        }
      });

      if (!userWithDetails) {
        throw new Error('Utilisateur non trouvé');
      }

      // Maintenant TypeScript sait que userWithDetails n'est pas null
      return res.json(userWithDetails);
    } catch (error) {
      return res.status(401).json({ 
        error: error instanceof Error ? error.message : 'Erreur d\'authentification' 
      });
    }
  }

  // GET /api/users/:id - Récupérer un profil
  getUserProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
          stats: true,
          bodyInfo: true,
          workouts: true
        }
      });
      if (!user) throw new Error('Utilisateur non trouvé');
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  }

  // PUT /api/users/:id - Mettre à jour un profil
  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, imageUrl, height, weight, goals } = req.body;
      
      const updatedUser = await this.prisma.user.update({
        where: { id: req.params.id },
        data: {
          firstName,
          lastName,
          imageUrl,
          bodyInfo: {
            update: {
              height,
              weight,
              goals
            }
          }
        },
        include: {
          stats: true,
          bodyInfo: true
        }
      });
      
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: 'Erreur mise à jour profil' });
    }
  }
}
