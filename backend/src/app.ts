import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import workoutRoutes from './routes/workout.routes';
import swaggerUi from 'swagger-ui-express';
import { initializeConfigs, specs } from './config';
import userRoutes from './routes/user.routes';
import initializeSocket from './socket';
import sessionRoutes from './routes/session.routes';

const app = express();
const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialiser Socket.IO
initializeSocket(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Hello from KaporalFit API' });
});

// Initialisation des configurations
initializeConfigs();

// Debug middleware pour voir les requêtes
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// Gestion globale des erreurs
// Attrape toutes les erreurs non gérées dans l'application
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔴 Erreur:', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

export { app, server };
