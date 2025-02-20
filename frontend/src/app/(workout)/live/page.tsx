"use client";
import { useState, useEffect } from "react";
import styles from "./live.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PoseDetector from '@/components/pose/PoseDetector';

type WorkoutType = "STRENGTH" | "CARDIO" | "YOGA" | "HIIT";

interface WorkoutState {
  type: WorkoutType | null;
  startTime: Date | null;
  duration: number;
  calories: number;
  isActive: boolean;
}

export default function LiveWorkoutPage() {
  const [workout, setWorkout] = useState<WorkoutState>({
    type: null,
    startTime: null,
    duration: 0,
    calories: 0,
    isActive: false
  });
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (workout.isActive && isCameraReady) {
      interval = setInterval(() => {
        setWorkout(prev => ({
          ...prev,
          duration: prev.duration + 1,
          calories: Math.floor(prev.duration * 0.15) // Estimation simple des calories
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [workout.isActive, isCameraReady]);

  const handleStart = (type: WorkoutType) => {
    setWorkout({
      type,
      startTime: new Date(),
      duration: 0,
      calories: 0,
      isActive: true
    });
  };

  const handlePause = () => {
    setWorkout(prev => ({ ...prev, isActive: false }));
  };

  const handleResume = () => {
    setWorkout(prev => ({ ...prev, isActive: true }));
  };

  const handleFinish = async () => {
    if (window.confirm("Voulez-vous terminer cette session ?")) {
      try {
        // TODO: Sauvegarder le workout dans la base de données
        toast.success("Workout sauvegardé !");
        setIsCameraActive(false);
        router.push("/workouts");
      } catch (error) {
        console.error('Erreur sauvegarde workout:', error);
        toast.error("Erreur lors de la sauvegarde");
      }
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  if (!workout.type) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Choisir un type de workout</h1>
        <div className={styles.typeGrid}>
          {["STRENGTH", "CARDIO", "YOGA", "HIIT"].map((type) => (
            <button
              key={type}
              className={styles.typeButton}
              onClick={() => handleStart(type as WorkoutType)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workout en cours</h1>
      
      <div className={styles.poseDetector} style={{ position: "relative" }}>
        <PoseDetector onCameraReady={handleCameraReady} isActive={isCameraActive} />
      </div>

      {isCameraReady && (
        <>
          <div className={styles.workoutInfo}>
            <span className={styles.type}>{workout.type}</span>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>Durée</span>
                <strong>
                  {Math.floor(workout.duration / 60)}:
                  {(workout.duration % 60).toString().padStart(2, "0")}
                </strong>
              </div>
              <div className={styles.stat}>
                <span>Calories</span>
                <strong>{workout.calories}</strong>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            {workout.isActive ? (
              <button className={styles.controlButton} onClick={handlePause}>
                Pause
              </button>
            ) : (
              <button className={styles.controlButton} onClick={handleResume}>
                Reprendre
              </button>
            )}
            <button className={styles.finishButton} onClick={handleFinish}>
              Terminer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
