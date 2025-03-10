import dotenv from 'dotenv'

/**
 * Configuration des variables d'environnement
 * Charge les variables depuis le fichier .env
 */
dotenv.config()

export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  firebaseCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  databaseUrl: process.env.DATABASE_URL
}
