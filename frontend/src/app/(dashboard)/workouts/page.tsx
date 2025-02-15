"use client";
import { useAuth } from "@/hooks/useAuth";
import styles from "./workouts.module.css";
import Link from "next/link";

export default function WorkoutsPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workouts</h1>

      {/* Section Démarrer un workout */}
      <section className={styles.startSection}>
        <h2>Commencer un workout</h2>
        <Link href="/live" className={styles.startButton}>
          Démarrer une session      
        </Link>
      </section>

      {/* Section Historique */}
      <section className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h2>Historique récent</h2>
          <Link href="/history" className={styles.viewAllLink}>
            Voir tout
          </Link>
        </div>
        
        <div className={styles.workoutGrid}>
          {user?.workouts?.slice(0, 4).map((workout) => (
            <div key={workout.id} className={styles.workoutCard}>
              <h3>{workout.type}</h3>
              <p>{new Date(workout.date).toLocaleDateString()}</p>
              <p>{workout.duration} min</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
