import { DecodedIdToken } from 'firebase-admin/auth'

/**
 * Extension des types Express
 * Permet d'ajouter des propriétés personnalisées aux objets Express
 */
declare global {
  namespace Express {
    /**
     * Extension de l'interface Request
     * Ajoute la propriété user pour stocker les informations
     * de l'utilisateur authentifié
     * 
     * @property user - Token décodé de Firebase contenant :
     * - uid: ID unique de l'utilisateur
     * - email: Email de l'utilisateur
     * - email_verified: Statut de vérification de l'email
     * - auth_time: Timestamp de l'authentification
     */
    interface Request {
      user?: DecodedIdToken
    }
  }
} 