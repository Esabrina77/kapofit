import { useEffect, useState } from 'react';
import styles from './VideoCall.module.css';
import { FaWifi } from 'react-icons/fa';

interface QualityIndicatorProps {
  stream: MediaStream;
}

export default function QualityIndicator({ stream }: QualityIndicatorProps) {
  const [quality, setQuality] = useState<'excellent' | 'good' | 'medium' | 'poor'>('good');
  const [isVisible, setIsVisible] = useState(false);
  const [lastQuality, setLastQuality] = useState<string>('good');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkQuality = () => {
      // Simulé pour l'exemple - à remplacer par de vraies stats WebRTC
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

      // Montrer l'indicateur uniquement si la qualité se dégrade
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

    interval = setInterval(checkQuality, 10000); // Vérifie toutes les 10 secondes
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