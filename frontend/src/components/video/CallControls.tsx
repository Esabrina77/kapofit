import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhoneSlash } from 'react-icons/fa';
import styles from './VideoCall.module.css';

interface CallControlsProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onShareScreen: () => void;
  onEndCall: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export default function CallControls({
  onToggleAudio,
  onToggleVideo,
  onShareScreen,
  onEndCall,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing
}: CallControlsProps) {
  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.controlButton} ${!isAudioEnabled ? styles.disabled : ''}`}
        onClick={onToggleAudio}
        title={isAudioEnabled ? "Désactiver le micro" : "Activer le micro"}
      >
        {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>

      <button 
        className={`${styles.controlButton} ${!isVideoEnabled ? styles.disabled : ''}`}
        onClick={onToggleVideo}
        title={isVideoEnabled ? "Désactiver la caméra" : "Activer la caméra"}
      >
        {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
      </button>

      <button 
        className={`${styles.controlButton} ${isScreenSharing ? styles.active : ''}`}
        onClick={onShareScreen}
        title={isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
      >
        <FaDesktop />
      </button>

      <button 
        className={`${styles.controlButton} ${styles.endCall}`}
        onClick={onEndCall}
        title="Terminer l'appel"
      >
        <FaPhoneSlash />
      </button>
    </div>
  );
} 