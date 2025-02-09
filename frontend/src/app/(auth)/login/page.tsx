"use client";

import { signIn } from "next-auth/react";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );
      
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (error) {
if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-email':
          toast.error('Email invalide');
          break;
        case 'auth/user-not-found':
          toast.error('Aucun compte associé à cet email');
          break;
        case 'auth/wrong-password':
          toast.error('Mot de passe incorrect');
          break;
        case 'auth/too-many-requests':
          toast.error('Trop de tentatives. Veuillez réessayer plus tard');
          break;
        default:
          toast.error('Erreur de connexion. Veuillez réessayer.');
      }
    }else{
        toast.error('Une erreur inattendue est survenue');
    }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast.info('Connexion annulée');
            break;
          case 'auth/unauthorized-domain':
            toast.error('Domaine non autorisé');
            break;
          case 'auth/user-disabled':
            toast.error('Compte désactivé');
            break;
          case 'auth/account-exists-with-different-credential':
            toast.error('Email déjà utilisé avec une autre méthode de connexion');
            break;
          default:
            toast.error('Erreur de connexion. Veuillez réessayer.');
        }
      } else {
        toast.error('Une erreur inattendue est survenue');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Login to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
      </form>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Image 
            src="/icons/google.svg" 
            alt="Google" 
            width={20} 
            height={20} 
            className="mr-2" 
          />
          Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Image 
            src="/icons/github.svg" 
            alt="GitHub" 
            width={20} 
            height={20} 
            className="mr-2" 
          />
          GitHub
        </button>
      </div>

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

