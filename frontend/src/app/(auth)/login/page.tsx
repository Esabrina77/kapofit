"use client";

import Link from "next/link";
import Image from 'next/image';
import { auth } from '@/lib/firebase/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );
      
      if (result.user) {
        const token = await result.user.getIdToken();
        console.log('🔑 Token:', token);
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            toast.error('Email invalide');
            break;
          case 'auth/user-disabled':
            toast.error('Compte désactivé');
            break;
          case 'auth/user-not-found':
            toast.error('Utilisateur non trouvé');
            break;
          case 'auth/wrong-password':
            toast.error('Mot de passe incorrect');
            break;
          default:
            toast.error('Erreur lors de la connexion');
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const token = await result.user.getIdToken();
        console.log('🔑 Token:', token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  };

  const showToken = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      console.log('🔑 Token:', token);
    } else {
      console.log('❌ Pas d\'utilisateur connecté');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Sign in
        </button>
        
        <button 
          type="button"
          onClick={handleGoogleSignIn} 
          className="w-full flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2" />
          Sign in with Google
        </button>
      </form>

      <button 
        onClick={showToken}
        className="w-full py-2 px-4 bg-gray-600 text-white rounded-md mt-4"
      >
        Afficher Token
      </button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

      <ToastContainer />
    </div>
  );
}

