import { useEffect } from 'react';
import styles from './VideoCall.module.css';
import { FaMicrophone, FaVideo, FaDesktop, FaExclamationTriangle } from 'react-icons/fa';

interface NotificationProps {
  type: 'audio' | 'video' | 'screen' | 'quality' | 'connection';
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function CallNotification({ type, message, duration = 3000, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'audio': return <FaMicrophone />;
      case 'video': return <FaVideo />;
      case 'screen': return <FaDesktop />;
      default: return <FaExclamationTriangle />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span className={styles.notificationIcon}>{getIcon()}</span>
      <span className={styles.notificationMessage}>{message}</span>
    </div>
  );
} 