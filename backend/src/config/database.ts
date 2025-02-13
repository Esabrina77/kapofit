import { PrismaClient } from '@prisma/client'

/**
 * Configuration de la base de données avec Prisma
 * Singleton pour éviter les connexions multiples
 */
class Database {
  private static instance: PrismaClient

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient()
    }
    return Database.instance
  }
}

export const prisma = Database.getInstance()
