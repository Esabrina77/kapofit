import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // 1. Récupérer John avec toutes ses données
    const john = await prisma.user.findUnique({
      where: { email: "john@test.com" },
      include: {
        bodyInfo: true,
        stats: true,
        workouts: {
          include: {
            exercises: true
          }
        }
      }
    })
    console.log("John's data:", JSON.stringify(john, null, 2))

    // 2. Mettre à jour ses stats
    const updatedStats = await prisma.stats.update({
      where: { userId: john?.id },
      data: {
        totalWorkouts: { increment: 1 },
        points: { increment: 50 }
      }
    })
    console.log("Updated stats:", updatedStats)

    // 3. Ajouter un nouveau workout
    const newWorkout = await prisma.workout.create({
      data: {
        userId: john?.id as string,
        duration: 1800, // 30 minutes
        type: "SOLO",
        status: "COMPLETED",
        exercises: {
          create: [
            {
              name: "Squats",
              sets: 3,
              reps: 15,
              score: 9.0
            }
          ]
        }
      }
    })
    console.log("New workout:", newWorkout)

  } catch (error) {
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 