# Documentation API KaporalFit

## 🔥 Base URL
```
http://localhost:3001/api
```

## 🏋️‍♂️ Workouts

### Créer un workout
```http
POST /workouts

{
  "userId": "string",
  "type": "SOLO",
  "exercises": [
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": 12
    }
  ]
}
```

### Récupérer les workouts d'un utilisateur
```http
GET /workouts/:userId
```

### Récupérer un workout spécifique
```http
GET /workouts/detail/:id
```

### Mettre à jour un workout (complet)
```http
PUT /workouts/:id

{
  "type": "SOLO",
  "status": "IN_PROGRESS",
  "exercises": [
    {
      "name": "Push-ups",
      "sets": 4,
      "reps": 15
    }
  ]
}
```

### Mettre à jour partiellement un workout
```http
PATCH /workouts/:id

{
  "exercises": [
    {
      "id": "exercise_id",
      "sets": 4
    }
  ]
}
```

### Compléter un workout
```http
PATCH /workouts/:id/complete

{
  "duration": 1800  // en secondes
}
```

### Supprimer un workout
```http
DELETE /workouts/:id
```

## 📊 Modèles de données

### Workout
```typescript
{
  id: string;
  userId: string;
  type: "SOLO" | "GROUP";
  status: "IN_PROGRESS" | "COMPLETED";
  duration: number;
  exercises: Exercise[];
  createdAt: Date;
}
```

### Exercise
```typescript
{
  id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  score: number | null;
}
```

## 🚦 Codes de retour

- `200` : Succès
- `201` : Création réussie
- `204` : Suppression réussie
- `400` : Requête invalide
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## 🔒 Authentification
*À venir dans une prochaine version*

## 📝 Notes
- Les durées sont en secondes
- Les workouts sont triés par date décroissante
- Les exercices sont liés à un seul workout

## 🔄 Exemples de requêtes

### Thunder Client
```http
### Créer un workout
POST http://localhost:3001/api/workouts
Content-Type: application/json

{
  "userId": "93f71129-1275-4cf6-b28c-de42d1810fa5",
  "type": "SOLO",
  "exercises": [
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": 12
    }
  ]
}

### Marquer comme terminé
PATCH http://localhost:3001/api/workouts/workout_id/complete
Content-Type: application/json

{
  "duration": 1800
}
```

## 🧪 Tests

Pour lancer les tests :
```bash
npm test
```

Les tests couvrent :
- Création de workouts
- Récupération des workouts
- Mise à jour des workouts
- Suppression des workouts
- Gestion des erreurs

## 🚀 Déploiement

1. Variables d'environnement requises :
```env
DATABASE_URL="postgresql://..."
PORT=3001
```

2. Commandes de déploiement :
```bash
npm install
npm run build
npm start
```

## 📈 Limites et performances
- Rate limiting : 100 requêtes/minute
- Taille maximale du body : 10MB
- Cache : 5 minutes pour les GET 