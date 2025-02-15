export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  score?: number | null;
}

// export interface CreateWorkoutDTO {
//   userId: string;
//   type: 'SOLO' | 'DUO';
//   exercises: Exercise[];
// }

export interface WorkoutResponse {
  id: string;
  userId: string;
  duration: number;
  type: string;
  status: string;
  exercises: Exercise[];
  createdAt: Date;
}

export interface UpdateWorkoutDTO {
  type?: string;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
  }[];
}

export interface FullWorkoutDTO {
  type: string;
  status: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
  }[];
}

export interface WorkoutDTO {
  type?: string;
  status?: string;
  duration?: number;
  exercises?: {
    id: string;
    name: string;
    sets: number;
    reps: number;
  }[];
}
