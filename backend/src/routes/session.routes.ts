import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Créer une nouvelle session
router.post('/create', async (req, res) => {
  const { hostId } = req.body;
  try {
    const session = await prisma.session.create({
      data: {
        roomId: Math.random().toString(36).substring(7),
        hostId,
      }
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
});

// Rejoindre une session
router.post('/join/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { guestId } = req.body;
  
  try {
    const session = await prisma.session.update({
      where: { roomId },
      data: {
        guestId,
        status: 'active'
      }
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion à la session' });
  }
});

export default router; 