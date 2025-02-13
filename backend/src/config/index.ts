/**
 * Point d'entrée pour toutes les configurations
 * Permet d'initialiser toutes les configurations au démarrage
 */
import { initializeFirebase } from './firebase-config'
import { prisma } from './database'
import { config } from './env'
import { specs } from './swagger'

export const initializeConfigs = async () => {
  try {
    // Initialiser Firebase
    initializeFirebase()
    
    // Tester la connexion à la base de données
    await prisma.$connect()
    
    console.log('✅ Configurations initialisées avec succès')
    console.log(`🌍 Environnement: ${config.nodeEnv}`)
    console.log(`🚀 Port: ${config.port}`)
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
    process.exit(1)
  }
}

export { prisma, config, specs } 