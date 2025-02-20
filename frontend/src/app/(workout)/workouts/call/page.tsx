"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import VideoCall from '@/components/video/VideoCall';
import styles from './call.module.css';
import { toast } from 'react-hot-toast';

export default function WorkoutCallPage() {
  const { user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = async () => {
    try {
      const newRoomId = Math.random().toString(36).substring(7);
      setRoomId(newRoomId);
      setIsInCall(true);
      toast.success('Salle créée avec succès');
      
    } catch (error) {
      toast.error('Erreur lors de la création de la salle');
    }
  };

  const handleJoinRoom = (event: React.FormEvent) => {
    event.preventDefault();
    if (roomId) {
      setIsInCall(true);
      toast.success('Connexion à la salle...');
    }
  };

  if (!user) return <div>Chargement...</div>;

  if (isInCall) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Session d&apos;entraînement en direct</h1>
        <div className={styles.roomInfo}>
          <p>Code de la salle : <span className={styles.roomCode}>{roomId}</span></p>
        </div>
        <VideoCall roomId={roomId} userId={user.id} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Démarrer une session</h1>

      <div className={styles.actions}>
        {!showJoinForm ? (
          <div className={styles.buttons}>
            <button 
              className={styles.createButton}
              onClick={handleCreateRoom}
            >
              Créer une session
            </button>
            <button 
              className={styles.joinButton}
              onClick={() => setShowJoinForm(true)}
            >
              Rejoindre une session
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoinRoom} className={styles.joinForm}>
            <input
              type="text"
              placeholder="Code de la salle"
              className={styles.input}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Rejoindre
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 