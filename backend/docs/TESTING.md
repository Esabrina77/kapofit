# Guide des Tests Unitaires

## 1. Pourquoi des tests unitaires ?
- Vérifient que chaque partie du code fonctionne isolément
- Détectent les bugs tôt
- Servent de documentation
- Facilitent les modifications

## 2. Structure d'un test
```typescript
describe('Groupe de tests', () => {      // Décrit un ensemble de tests
  beforeEach(() => {                     // Exécuté avant chaque test
    // Configuration
  })

  it('devrait faire quelque chose', () => {  // Un test spécifique
    // Arrange (Préparation)
    const input = {...}
    
    // Act (Action)
    const result = function(input)
    
    // Assert (Vérification)
    expect(result).toBe(expected)
  })
})
```

## 3. Les Mocks
- Simulent des dépendances (comme Prisma)
- Permettent de tester sans base de données
- Exemple :
```typescript
jest.mock('@prisma/client')  // Mock toute la librairie
const mockPrisma = {         // Crée un faux objet Prisma
  workout: {
    create: jest.fn()        // Crée une fonction mock
  }
}
```

## 4. Comment écrire un bon test
1. Identifier ce qu'on veut tester
2. Préparer les données de test
3. Exécuter la fonction
4. Vérifier le résultat
5. Vérifier les effets secondaires (appels de fonction)

## 5. Exemple commenté
```typescript
describe('WorkoutService', () => {
  // Préparation avant chaque test
  beforeEach(() => {
    jest.clearAllMocks()  // Réinitialise tous les mocks
  })

  // Test de création d'un workout
  it('should create a workout', async () => {
    // Arrange : Prépare les données de test
    const mockWorkout = {
      id: '123',
      // ... autres données
    }
    mockPrisma.workout.create.mockResolvedValue(mockWorkout)

    // Act : Exécute la fonction
    const result = await workoutService.createWorkout({...})

    // Assert : Vérifie le résultat
    expect(result).toHaveProperty('id', '123')
    expect(mockPrisma.workout.create).toHaveBeenCalled()
  })
})
``` 