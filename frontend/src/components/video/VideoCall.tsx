"use client";
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './VideoCall.module.css';
import { toast } from 'react-hot-toast';
import CallControls from './CallControls';
import { useRouter } from 'next/navigation';

interface VideoCallProps {
  roomId: string;
  userId: string;
}

export default function VideoCall({ roomId, userId }: VideoCallProps) {
  const router = useRouter();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    initializeCall();
    return () => {
      cleanupCall();
    };
  }, [roomId, userId]);

  const initializeCall = async () => {
    try {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL as string);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      socketRef.current.emit("join-room", { roomId, userId });
      setIsConnected(true);
      toast.success('Connecté au serveur');
    } catch (err) {
      console.error("Erreur initialisation:", err);
      toast.error("Erreur lors de l'initialisation de l'appel");
    }
  };

  const cleanupCall = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    socketRef.current?.disconnect();
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
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
      console.error("Erreur partage d'écran:", err);
      toast.error("Erreur lors du partage d'écran");
    }
  };

  const endCall = () => {
    cleanupCall();
    toast.success("Appel terminé");
    router.push('/workouts');
  };

  return (
    <div className={styles.videoContainer}>
      <video playsInline muted ref={userVideo} autoPlay className={styles.video} />
      {isConnected && <video playsInline ref={peerVideo} autoPlay className={styles.video} />}
      
      <CallControls 
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onShareScreen={shareScreen}
        onEndCall={endCall}
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
      />
    </div>
  );
}