import { Request, Response, NextFunction } from 'express'
import { getAuth } from 'firebase-admin/auth'

/**
 * Middleware d'authentification Firebase
 * Vérifie la présence et la validité du token JWT dans le header Authorization
 * 
 * @param req - Requête Express
 * @param res - Réponse Express
 * @param next - Fonction suivante dans la chaîne middleware
 * 
 * Headers requis:
 * Authorization: Bearer <token_jwt>
 * 
 * Erreurs possibles:
 * - 401: Token manquant
 * - 401: Token invalide
 */
export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Extraire le token du header Authorization
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    // Vérifier le token Firebase
    const decodedToken = await getAuth().verifyIdToken(token)
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = decodedToken
    
    // Passer à la suite
    next()
  } catch (error) {
    console.error('Erreur auth:', error)
    res.status(401).json({ error: 'Token invalide' })
  }
} 