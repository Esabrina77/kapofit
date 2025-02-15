import { useState } from 'react';
import { User } from '@/types/user'; 
import styles from './EditProfileForm.module.css';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { auth } from '@/lib/firebase/firebase';

interface EditProfileFormProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const AVAILABLE_GOALS = [
  'WEIGHT_LOSS',
  'MUSCLE_GAIN',
  'ENDURANCE',
  'FLEXIBILITY',
  'STRENGTH'
];

export default function EditProfileForm({ user, onClose, onUpdate }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    height: user?.bodyInfo?.height || '',
    weight: user?.bodyInfo?.weight || '',
    goals: user?.bodyInfo?.goals || [],
    level: user?.bodyInfo?.level || 'BEGINNER'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer le token Firebase
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bodyInfo: {
            height: Number(formData.height),
            weight: Number(formData.weight),
            goals: formData.goals,
            level: formData.level
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        toast.success('Profil mis à jour !');
        onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formGroup}>
        <label>Prénom</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Nom</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Taille (cm)</label>
        <input
          type="number"
          value={formData.height}
          onChange={(e) => setFormData({...formData, height: e.target.value})}
          min="0"
          max="300"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Poids (kg)</label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({...formData, weight: e.target.value})}
          min="0"
          max="300"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Niveau</label>
        <select 
          value={formData.level}
          onChange={(e) => setFormData({...formData, level: e.target.value})}
        >
          <option value="BEGINNER">Débutant</option>
          <option value="INTERMEDIATE">Intermédiaire</option>
          <option value="ADVANCED">Avancé</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Objectifs</label>
        <div className={styles.goalsGrid}>
          {AVAILABLE_GOALS.map(goal => (
            <div key={goal} className={styles.goalItem}>
              <input
                type="checkbox"
                id={goal}
                checked={formData.goals.includes(goal)}
                onChange={() => handleGoalToggle(goal)}
              />
              <label htmlFor={goal}>
                {goal.split('_').map(word => 
                  word.charAt(0) + word.slice(1).toLowerCase()
                ).join(' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button 
          type="button" 
          onClick={onClose}
          className={styles.cancelButton}
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </form>
  );
} 