import axios from 'axios';
import { auth } from './firebase/firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Erreur récupération token:', error);
    return config;
  }
});

interface CreateWorkoutDTO {
  type: string;
  duration: number;
  userId: string;
}

export const workoutApi = {
  create: async (data: CreateWorkoutDTO) => {
    return api.post('/api/workouts', data);
  },
  
  getAll: async (userId: string) => {
    return api.get(`/api/workouts/user/${userId}`);
  },
  
  complete: async (id: string, duration: number) => {
    return api.patch(`/api/workouts/${id}/complete`, { duration });
  }
};

export default api; 