"use client";
import { useAuth } from "@/hooks/useAuth";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Historique des workouts</h1>

      <div className={styles.workoutList}>
        {user?.workouts?.map((workout) => (
          <div key={workout.id} className={styles.workoutItem}>
            <div className={styles.workoutInfo}>
              <h3>{workout.type}</h3>
              <p>{new Date(workout.date).toLocaleDateString()}</p>
            </div>
            <div className={styles.workoutStats}>
              <span>{workout.duration} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
