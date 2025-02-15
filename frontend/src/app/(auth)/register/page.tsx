"use client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
    const router = useRouter();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // 1. Créer l'utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );

      // 2. Créer l'utilisateur dans notre base de données
      const response = await fetch('http://localhost:3002/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
        },
        body: JSON.stringify({
          email: userCredential.user.email,
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          firebaseId: userCredential.user.uid,
          imageUrl: userCredential.user.photoURL
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du profil');
      }

      // 3. Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur inscription:', error);
      toast.error('Erreur lors de l\'inscription');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        const token = await result.user.getIdToken();
        
        // Utiliser la route sync-firebase
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-firebase`, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erreur Google Sign In:', error);
      toast.error('Erreur lors de la connexion avec Google');
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join KaporalFit today
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

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


          Sign up
        </button>
        
        <button onClick={handleGoogleSignIn} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2" />
          Google
        </button>
      </form>

      <p className="text-center text-sm">

        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>

      <ToastContainer />
    </div>
  );
}
