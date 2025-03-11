"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import styles from "./profile.module.css";
import Image from 'next/image';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { User } from "@/types/user";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple"></div>
    </div>;
  }

  const handleUpdateUser = (updatedUser: User) => {
    if (updateUser) {
      updateUser(updatedUser);
    }
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      {isEditing ? (
        <EditProfileForm 
          user={user} 
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdateUser}
        />
      ) : (
        <div className={styles.profileCard}>
          {/* Photo de profil */}
          <div className={styles.avatarSection}>
            <Image 
              src={user?.imageUrl || '/default-avatar.png'} 
              alt="Profile" 
              width={120}
              height={120}
              className={styles.avatar}
            />
          </div>

          {/* Informations personnelles */}
          <div className={styles.infoSection}>
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p>{user?.email}</p>
            <p>Level: {user?.bodyInfo?.level || 'BEGINNER'}</p>
          </div>

          {/* Stats */}
          <div className={styles.statsSection}>
            <div>
              <h3>Height</h3>
              <p>{user?.bodyInfo?.height || 'Not set'} cm</p>
            </div>
            <div>
              <h3>Weight</h3>
              <p>{user?.bodyInfo?.weight || 'Not set'} kg</p>
            </div>
            <div>
              <h3>Goals</h3>
              <p>{user?.bodyInfo?.goals?.join(', ') || 'No goals set'}</p>
            </div>
          </div>

          {/* Bouton d'édition */}
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}