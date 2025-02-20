import { FaCircle } from 'react-icons/fa';
import styles from './VideoCall.module.css';

interface CallStatusProps {
  isConnected: boolean;
  roomId: string;
}

export default function CallStatus({ isConnected, roomId }: CallStatusProps) {
  return (
    <div className={styles.statusBar}>
      <FaCircle color={isConnected ? '#22c55e' : '#dc2626'} size={12} />
      <span>{isConnected ? 'Connecté' : 'En attente de connexion'}</span>
      <span>•</span>
      <span>Salle: {roomId}</span>
    </div>
  );
} 