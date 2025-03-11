import { useEffect, useState } from 'react';
import styles from './VideoCall.module.css';
import { FaWifi } from 'react-icons/fa';

interface QualityIndicatorProps {
  stream: MediaStream;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QualityIndicator({ stream }: QualityIndicatorProps) {
  const [quality, setQuality] = useState<'excellent' | 'good' | 'medium' | 'poor'>('good');
  const [isVisible, setIsVisible] = useState(false);
  const [lastQuality, setLastQuality] = useState<string>('good');

  useEffect(() => {
    const checkQuality = () => {
      // Pour l'instant on utilise une simulation
      // TODO: Implémenter la vraie qualité avec stream.getTracks() et RTCPeerConnection.getStats()
      const randomQuality = Math.random();
      let newQuality: 'excellent' | 'good' | 'medium' | 'poor';
      
      if (randomQuality > 0.75) {
        newQuality = 'excellent';
      } else if (randomQuality > 0.5) {
        newQuality = 'good';
      } else if (randomQuality > 0.25) {
        newQuality = 'medium';
      } else {
        newQuality = 'poor';
      }

      if (
        (lastQuality === 'excellent' && newQuality !== 'excellent') ||
        (lastQuality === 'good' && (newQuality === 'medium' || newQuality === 'poor')) ||
        (lastQuality === 'medium' && newQuality === 'poor')
      ) {
        setQuality(newQuality);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 3000);
      }

      setLastQuality(newQuality);
    };

    const interval = setInterval(checkQuality, 10000);
    return () => clearInterval(interval);
  }, [lastQuality]);

  const getQualityEmoji = () => {
    switch (quality) {
      case 'excellent': return '🚀';
      case 'good': return '👍';
      case 'medium': return '👌';
      case 'poor': return '😢';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.qualityBadge} ${styles.visible} ${styles[quality]}`}>
      <FaWifi className={styles.wifiIcon} />
      <span className={styles.qualityEmoji}>{getQualityEmoji()}</span>
    </div>
  );
} 