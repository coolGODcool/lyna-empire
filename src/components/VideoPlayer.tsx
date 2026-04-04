import React, { useRef, useEffect, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  isActive: boolean;
}

export default function VideoPlayer({ src, poster, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(err => console.log("Autoplay blocked", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
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
