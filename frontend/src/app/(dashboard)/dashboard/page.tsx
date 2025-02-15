"use client";
import { useAuth } from "@/hooks/useAuth";
import { FiActivity, FiClock, FiAward } from 'react-icons/fi';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple"></div>
    </div>;
  }

  // Formatage des données
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h${minutes % 60}m`;
  };

  return (
    <div className="p-8">
      {/* En-tête */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Hello, {user?.firstName || 'Athlete'}!
          </h1>
          <p className={styles.subtitle}>Level {user?.stats?.level || 1}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.statsDot}></div>
          <FiActivity className={styles.statsIcon} />
          <h3 className={styles.statsValue}>{user?.stats?.totalWorkouts || 0}</h3>
          <p className={styles.statsLabel}>Workouts</p>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsDot}></div>
          <FiClock className={styles.statsIcon} />
          <h3 className={styles.statsValue}>
            {formatTime(user?.stats?.totalTime || 0)}
          </h3>
          <p className={styles.statsLabel}>Total Time</p>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsDot}></div>
          <FiAward className={styles.statsIcon} />
          <h3 className={styles.statsValue}>{user?.stats?.points || 0}</h3>
          <p className={styles.statsLabel}>Points</p>
        </div>
      </div>

      {/* Programme du jour */}
      <div className={styles.todayPlan}>
        <h2 className={styles.planTitle}>Today&apos;s Plan</h2>
        <div className={styles.planCard}>
          <div>
            <h3 className={styles.planInfo}>
              {user?.bodyInfo?.level || 'BEGINNER'} Workout
            </h3>
            <p className={styles.planSubtext}>
              {user?.bodyInfo?.goals?.join(', ') || 'Set your goals in profile!'}
            </p>
          </div>
          <button className={styles.startButton}>
            Start
          </button>
        </div>
      </div>

      {/* Derniers workouts */}
      {user?.workouts && user.workouts.length > 0 && (
        <div className={styles.todayPlan}>
          <h2 className={styles.planTitle}>Recent Workouts</h2>
          {user.workouts.slice(0, 3).map((workout) => (
            <div key={workout.id} className={styles.planCard}>
              <div>
                <h3 className={styles.planInfo}>{workout.type}</h3>
                <p className={styles.planSubtext}>
                  {new Date(workout.date).toLocaleDateString()}
                </p>
              </div>
              <span className={styles.statsLabel}>
                {workout.duration}min
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}