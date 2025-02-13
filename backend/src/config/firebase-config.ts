import * as admin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'

/**
 * Configuration de Firebase Admin SDK
 * Utilise les credentials du fichier de service
 */
export const initializeFirebase = () => {
  // En production, utiliser les variables d'environnement
  if (process.env.NODE_ENV === 'production') {
    admin.initializeApp({
      credential: applicationDefault()
    })
  } else {
    // En développement, utiliser le fichier de service
    const serviceAccount = require('./firebase-service-account.json')
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }
} 