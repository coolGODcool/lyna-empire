// 影音播放器組件，支援自動播放、靜音循環與原生級滾動對齊。
import React, { useRef, useEffect, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  isActive: boolean;
  isPaused?: boolean;
  muted?: boolean;
}

export default function VideoPlayer({ src, poster, isActive, isPaused = false, muted = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        if (isPaused) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(err => console.log("Autoplay blocked", err));
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, isPaused]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted={muted}
        playsInline
        autoPlay
        preload="auto"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <img 
          src={poster} 
          alt="Poster" 
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
    </div>
  );
}
