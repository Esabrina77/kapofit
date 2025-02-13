import express from 'express';
import cors from 'cors';
import workoutRoutes from './routes/workout.routes';
import swaggerUi from 'swagger-ui-express';
import { initializeConfigs, specs, config } from './config';
import userRoutes from './routes/user.routes';

const app = express();

// Initialiser toutes les configurations
initializeConfigs()
  .then(() => console.log('🔥 Firebase initialisé'))
  .catch(error => console.error('❌ Erreur Firebase:', error));

// Middlewares de base
app.use(cors());  // Permet les requêtes cross-origin (depuis le frontend)
app.use(express.json());  // Parse les body en JSON automatiquement

// Debug middleware pour voir les requêtes
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// Routes de l'API
// Toutes les routes workout commencent par /api/workouts
// Exemple: POST /api/workouts pour créer un workout
//         GET /api/workouts/user/123 pour voir les workouts de l'user 123
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Gestion globale des erreurs
// Attrape toutes les erreurs non gérées dans l'application
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔴 Erreur:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation sur http://localhost:${PORT}/api-docs`);
});

export default app;
