"use client";
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './VideoCall.module.css';
import { toast } from 'react-hot-toast';
import CallControls from './CallControls';
import CallStatus from './CallStatus';
import { useRouter } from 'next/navigation';
import CallNotification from './CallNotification';
import QualityIndicator from './QualityIndicator';

interface VideoCallProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function VideoCall({ roomId, userId, userName }: VideoCallProps) {
  const router = useRouter();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peerName, setPeerName] = useState<string>('');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'audio' | 'video' | 'screen' | 'quality' | 'connection';
    message: string;
  }>>([]);
  const [isPipMode, setIsPipMode] = useState(false);

  useEffect(() => {
    initializeCall();
    return () => cleanupCall();
  }, [roomId, userId]);

  useEffect(() => {
    const handleResize = () => {
      setIsPipMode(window.innerWidth <= 768);
    };

    // Vérifier la taille initiale
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initializeCall = async () => {
    try {
      setIsLoading(true);
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL as string);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      socketRef.current.emit("join-room", { roomId, userId, userName });
      setIsConnected(true);
      toast.success('Connecté au serveur');
    } catch (err) {
      console.error("Erreur initialisation:", err);
      toast.error("Erreur lors de l'initialisation de l'appel");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupCall = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    socketRef.current?.disconnect();
  };

  const addNotification = (type: 'audio' | 'video' | 'screen' | 'quality' | 'connection', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      addNotification('audio', 
        audioTrack.enabled ? 'Microphone activé' : 'Microphone désactivé'
      );
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const shareScreen = async () => {
    try {
      if (isScreenSharing) {
        // Revenir à la caméra
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        streamRef.current = stream;
        setIsScreenSharing(false);
      } else {
        // Partager l'écran
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        streamRef.current = stream;
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error("Erreur partage d&apos;écran:", err);
      toast.error("Erreur lors du partage d&apos;écran");
    }
  };

  const endCall = () => {
    cleanupCall();
    toast.success("Appel terminé");
    router.push('/workouts');
  };

  return (
    <div className={styles.container}>
      <CallStatus isConnected={isConnected} roomId={roomId} />
      
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <video 
            playsInline 
            muted 
            ref={userVideo} 
            autoPlay 
            className={styles.video} 
          />
          <div className={styles.userInfo}>
            <span>{userName} (Vous)</span>
          </div>
          {streamRef.current && <QualityIndicator stream={streamRef.current} />}
        </div>

        {isConnected && (
          <div className={`${styles.videoWrapper} ${isPipMode ? styles.pip : ''}`}>
            <video 
              playsInline 
              ref={peerVideo} 
              autoPlay 
              className={styles.video} 
            />
            <div className={styles.userInfo}>
              <span>{peerName || 'En attente...'}</span>
            </div>
          </div>
        )}
      </div>

      <CallControls 
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onShareScreen={shareScreen}
        onEndCall={endCall}
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
      />

      {notifications.map(notification => (
        <CallNotification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Initialisation de l'appel...</p>
        </div>
      )}
    </div>
  );
}