import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

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
}
