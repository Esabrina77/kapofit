import { User } from '@/types/user';
import { auth } from '@/lib/firebase/firebase';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-firebase`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: firebaseUser.email,
              firebaseId: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            })
          });

          if (!response.ok) throw new Error('Erreur API');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Erreur récupération données:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return { user, loading, updateUser };
}; 