"use client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword , GoogleAuthProvider , signInWithPopup, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RegisterPage() {
    const router = useRouter();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );
      
      if (result.user) {
        // Mettre à jour le profil avec le nom
        await updateProfile(result.user, {
          displayName: formData.get("name") as string
        });
        
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('Email déjà utilisé');
            break;
          case 'auth/invalid-email':
            toast.error('Email invalide');
            break;
          case 'auth/operation-not-allowed':
            toast.error('Inscription par email désactivée');
            break;
          case 'auth/weak-password':
            toast.error('Mot de passe trop faible');
            break;
          default:
            toast.error('Erreur lors de l\'inscription');
        }
      } else {
        toast.error('Une erreur inattendue est survenue');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            router.push("/dashboard");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion avec Google:", error);
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
