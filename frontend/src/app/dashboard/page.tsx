"use client";
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    // Récupérer le token
    user.getIdToken().then(token => {
      console.log('🔑 Token:', token);
      setToken(token);
    });
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {token && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Votre Token :</h2>
          <p className="break-all font-mono text-sm">{token}</p>
        </div>
      )}
    </div>
  );
} 