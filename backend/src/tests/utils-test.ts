import { createUser, getUserWithAll, createWorkout, updateBodyInfo } from '../utils/prisma-utils'

async function testUtils() {
  try {
    // 1. Récupérer Jane (ou la créer si elle n'existe pas)
    let jane = await getUserWithAll("jane@test.com")
    
    if (!jane) {
      jane = await createUser({
        email: "jane@test.com",
        firstName: "Jane",
        lastName: "Doe",
        firebaseId: "test456"
      })
    }

    // 2. Ajouter ses infos physiques
    const bodyInfo = await updateBodyInfo({
      userId: jane.id,
      height: 165,
      weight: 60,
      goals: ['WEIGHT_LOSS', 'FLEXIBILITY'],
      level: 'BEGINNER'
    })
    console.log("Infos physiques ajoutées:", bodyInfo)

    // 3. Créer un workout
    const workout = await createWorkout({
      userId: jane.id,
      duration: 2700,
      type: 'SOLO',
      exercises: [
        { name: 'Squats', sets: 3, reps: 15, score: 8.5 },
        { name: 'Pompes', sets: 3, reps: 10, score: 7.5 }
      ]
    })
    console.log("Workout créé:", workout)

  } catch (error) {
    console.error("Erreur:", error)
  }
}

testUtils() 