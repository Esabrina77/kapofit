# Guide Prisma - KaporalFit

## Table des Matières
1. [Introduction](#1-introduction)
2. [Installation et Setup](#2-installation-et-setup)
3. [Schéma de Base de Données](#3-schéma-de-base-de-données)
4. [Opérations CRUD](#4-opérations-crud)
5. [Relations](#5-relations)
6. [Migrations](#6-migrations)
7. [Debugging](#7-debugging)

## 1. Introduction

### Qu'est-ce que Prisma ?
Prisma est un ORM (Object-Relational Mapping) moderne pour Node.js et TypeScript qui :
- Simplifie les interactions avec la base de données
- Fournit un typage fort avec TypeScript
- Offre une interface intuitive pour les requêtes
- Gère automatiquement les migrations

### Pourquoi Prisma dans KaporalFit ?
- Type-safety entre la DB et le code
- Auto-completion puissante
- Gestion simplifiée des relations
- Performance optimisée

## 2. Installation et Setup

### Installation
```bash
# Dans le dossier backend
cd backend

# Installation des dépendances
npm install @prisma/client prisma

# Initialisation de Prisma
npx prisma init
```

### Configuration
1. Créer le fichier `.env`:
```env
DATABASE_URL="postgresql://kaporalfit:kaporalfit@localhost:5432/kaporalfit"
```

2. Vérifier `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 3. Schéma de Base de Données

### Modèles Principaux
```prisma
// prisma/schema.prisma

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  password  String
  workouts  Workout[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Workout {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  type        String    // ex: "strength", "cardio"
  duration    Int       // en minutes
  exercises   Exercise[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Exercise {
  id        String   @id @default(uuid())
  workoutId String
  workout   Workout  @relation(fields: [workoutId], references: [id])
  name      String
  sets      Int
  reps      Int
  weight    Float?   // en kg
  notes     String?
}
```

## 4. Opérations CRUD

### Création du Client
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma
```

### Exemples d'Opérations

#### Création
```typescript
// Créer un utilisateur
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: hashedPassword
  }
});

// Créer un workout avec exercises
const workout = await prisma.workout.create({
  data: {
    userId: user.id,
    type: 'strength',
    duration: 60,
    exercises: {
      create: [
        { name: 'Squat', sets: 3, reps: 10, weight: 80 },
        { name: 'Bench Press', sets: 3, reps: 8, weight: 60 }
      ]
    }
  },
  include: {
    exercises: true
  }
});
```

#### Lecture
```typescript
// Trouver un utilisateur avec ses workouts
const userWithWorkouts = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    workouts: {
      include: {
        exercises: true
      }
    }
  }
});

// Recherche avec filtres
const strengthWorkouts = await prisma.workout.findMany({
  where: {
    type: 'strength',
    duration: {
      gte: 30 // plus grand ou égal à 30 minutes
    }
  }
});
```

## 5. Relations

### Types de Relations
- One-to-Many (User -> Workouts)
- Many-to-One (Workout -> User)
- Many-to-Many (à implémenter si besoin)

### Exemple de Relation
```typescript
// Trouver tous les exercices d'un utilisateur
const userExercises = await prisma.exercise.findMany({
  where: {
    workout: {
      userId: userId
    }
  },
  include: {
    workout: true
  }
});
```

## 6. Migrations

### Commandes Essentielles
```bash
# Créer une migration
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Reset la base de données
npx prisma migrate reset
```

## 7. Debugging

### Prisma Studio
```bash
# Lancer l'interface d'administration
npx prisma studio
```

### Logging
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Erreurs Communes
1. Connection Failed
```bash
# Vérifier
- URL de la base de données
- Credentials
- Firewall/Ports
```

2. Migration Failed
```bash
# Solutions
1. Backup des données
2. Reset de la base
3. Réappliquer les migrations
```

## Ressources
- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Examples](https://github.com/prisma/prisma-examples)
- [Prisma Discord](https://discord.gg/prisma) 