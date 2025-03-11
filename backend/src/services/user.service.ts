import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

export class UserService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createUser(data: {
    email: string
    firstName: string
    lastName: string
    password?: string
    firebaseId?: string
    imageUrl?: string
  }) {
    try {
      // Vérifier si l'email existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }

      // Hash du mot de passe si fourni
      let hashedPassword = null;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      // Créer l'utilisateur avec le mot de passe hashé
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
          firebaseId: data.firebaseId || null,
          imageUrl: data.imageUrl,
          stats: {
            create: {}
          },
          bodyInfo: {
            create: {
              goals: [],
              level: 'BEGINNER'
            }
          }
        },
        include: {
          stats: true,
          bodyInfo: true
        }
      })

      return user
    } catch (error) {
      console.error('Erreur création utilisateur:', error)
      throw error
    }
  }

  async verifyPassword(email: string, password: string) {
    try {
      console.log('⌛ Vérification pour:', email);
      
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      console.log('👤 Utilisateur trouvé:', user);

      if (!user || !user.password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      console.log('🔐 Comparaison des mots de passe...');
      const isValid = await bcrypt.compare(password, user.password);
      console.log('✅ Résultat comparaison:', isValid);

      if (!isValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      return user;
    } catch (error) {
      console.error('❌ Erreur vérification:', error);
      throw error;
    }
  }

  async syncFirebaseUser(firebaseUser: any) {
    try {
      console.log('Tentative de synchronisation pour:', firebaseUser.email);
      
      // Vérifier si l'utilisateur existe déjà
      let user = await this.prisma.user.findUnique({
        where: { email: firebaseUser.email }
      });

      if (!user) {
        console.log('Création d\'un nouvel utilisateur');
        // Créer l'utilisateur dans Prisma
        user = await this.prisma.user.create({
          data: {
            email: firebaseUser.email,
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            imageUrl: firebaseUser.photoURL,
            firebaseId: firebaseUser.uid,
            stats: {
              create: {
                totalTime: 0,
                points: 0,
                level: 1
              }
            },
            bodyInfo: {
              create: {
                height: null,
                weight: null,
                goals: [],
                level: 'BEGINNER'
              }
            }
          },
          include: {
            stats: true,
            bodyInfo: true
          }
        });
        console.log('Utilisateur créé:', user);
      } else {
        console.log('Utilisateur existant trouvé');
      }

      return user;
    } catch (error) {
      console.error('Erreur service synchronisation:', error);
      throw error;
    }
  }

  async syncUserStats(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Calculer le total des workouts
      const totalWorkouts = await tx.workout.count({
        where: { userId }
      });

      // Calculer le temps total
      const workouts = await tx.workout.findMany({
        where: { userId }
      });
      const totalTime = workouts.reduce((sum, w) => sum + w.duration, 0);

      // Mettre à jour les stats
      return tx.stats.update({
        where: { userId },
        data: {
          totalWorkouts,
          totalTime,
          points: totalWorkouts * 10 // 10 points par workout
        }
      });
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
      
      // 1. Supprimer les exercices des workouts
      await tx.exercise.deleteMany({
        where: {
          workout: {
            userId: userId
          }
        }
      });

      // 2. Supprimer les workouts
      await tx.workout.deleteMany({
        where: { userId }
      });

      // 3. Supprimer les stats
      await tx.stats.delete({
        where: { userId }
      });

      // 4. Supprimer les infos corporelles
      await tx.bodyInfo.delete({
        where: { userId }
      });

      // 5. Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: userId }
      });
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        stats: true,
        bodyInfo: true,
        workouts: true
      }
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        stats: true,
        bodyInfo: true
      }
    });
  }

  async updateUser(id: string, data: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    bodyInfo?: {
      height?: number;
      weight?: number;
      goals?: string[];
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    };
  }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        bodyInfo: data.bodyInfo ? {
          update: data.bodyInfo
        } : undefined
      },
      include: {
        stats: true,
        bodyInfo: true
      }
    });
  }
}
