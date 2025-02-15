import { Workout } from './workout';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  firebaseId?: string;
  bodyInfo?: {
    height?: number;
    weight?: number;
    goals?: string[];
    level?: string;
  };
  stats?: {
    totalWorkouts: number;
    totalTime: number;
    points: number;
    level: number;
  };
  workouts?: Workout[];
} 