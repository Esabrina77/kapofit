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

  // CREATE
  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  }

  // READ
  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      return res.json(user);
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
  }

  // UPDATE
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedUser = await this.userService.updateUser(id, req.body);
      return res.json(updatedUser);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  }

  // DELETE
  deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.status(204).send();
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  }

  // Méthodes spécifiques
  syncFirebaseUser = async (req: Request, res: Response) => {
    try {
      console.log('🔄 Request body:', req.body);
      const { email, firebaseId, displayName, photoURL } = req.body;
      
      if (!email || !firebaseId) {
        return res.status(400).json({ 
          error: "Email et firebaseId requis",
          received: req.body
        });
      }

      // Extraire firstName et lastName du displayName
      let firstName = 'New';
      let lastName = 'User';
      
      if (displayName) {
        const names = displayName.split(' ');
        firstName = names[0] || 'New';
        lastName = names.slice(1).join(' ') || 'User';
      }

      // Chercher l'utilisateur
      let user = await this.prisma.user.findFirst({
        where: { firebaseId },
        include: {
          stats: true,
          bodyInfo: true
        }
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            firebaseId,
            firstName,
            lastName,
            imageUrl: photoURL,
            stats: {
              create: {
                totalWorkouts: 0,
                totalTime: 0,
                points: 0,
                level: 1
              }
            },
            bodyInfo: {
              create: {
                level: 'BEGINNER',
                goals: []
              }
            }
          },
          include: {
            stats: true,
            bodyInfo: true
          }
        });
      }

      return res.json(user);
    } catch (error) {
      console.error('❌ Error syncing Firebase user:', error);
      return res.status(500).json({ 
        error: "Erreur lors de la synchronisation",
        details: error.message,
        body: req.body
      });
    }
  }

  syncUserStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.userService.syncUserStats(req.params.id);
      return res.json(stats);
    } catch (error) {
      console.error('❌ Error syncing user stats:', error);
      return res.status(500).json({ error: "Erreur lors de la synchronisation des stats" });
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
      const { id } = req.params;

      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          stats: true,
          bodyInfo: true,
          workouts: {
            take: 5,
            orderBy: {
              date: 'desc'
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Ne pas renvoyer le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);

    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération du profil' 
      });
    }
  }

  // PUT /api/users/:id - Mettre à jour un profil
  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, imageUrl, height, weight, goals } = req.body;
      
      // Validation basique
      if (height && (height < 100 || height > 250)) {
        return res.status(400).json({ error: 'Taille invalide (entre 100 et 250 cm)' });
      }
      
      if (weight && (weight < 30 || weight > 250)) {
        return res.status(400).json({ error: 'Poids invalide (entre 30 et 250 kg)' });
      }

      const validGoals = ['CARDIO', 'MUSCULATION', 'PERTE_DE_POIDS', 'SOUPLESSE'] as const;
      type Goal = typeof validGoals[number];
      if (goals && !goals.every((goal: string) => validGoals.includes(goal as Goal))) {
        return res.status(400).json({ error: 'Objectifs invalides' });
      }

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
