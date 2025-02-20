import React, { useRef, useEffect, useState } from 'react';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";
import styles from './PoseDetector.module.css';

interface PoseDetectorProps {
  onCameraReady: () => void;
  isActive: boolean;
}

const PoseDetector: React.FC<PoseDetectorProps> = ({ onCameraReady, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createPoseLandmarker = async () => {
      setIsLoading(true);
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });
      setIsLoading(false);
      enableCam();
    };

    if (isActive) {
      createPoseLandmarker();
    } else {
      setIsLoading(false);
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = undefined;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [isActive]);

  const enableCam = async () => {
    if (!poseLandmarkerRef.current) {
      console.log("Wait! PoseLandmarker not loaded yet.");
      return;
    }

    const constraints = {
      video: true
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          setIsLoading(false);
          onCameraReady();
          predictWebcam();
        });
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const predictWebcam = async () => {
    if (videoRef.current && canvasRef.current && poseLandmarkerRef.current) {
      const video = videoRef.current;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      
      if (canvasCtx) {
        const drawingUtils = new DrawingUtils(canvasCtx);

        const startTimeMs = performance.now();
        await poseLandmarkerRef.current.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
          canvasCtx.restore();
        });

        window.requestAnimationFrame(predictWebcam);
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>Loading...</div>}
      <video ref={videoRef} className={styles.video} autoPlay playsInline></video>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
};

export default PoseDetector;
