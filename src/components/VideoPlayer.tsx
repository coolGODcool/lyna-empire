// 影音播放器組件，支援自動播放、靜音循環與原生級滾動對齊。
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  isActive: boolean;
  isPaused?: boolean;
  muted?: boolean;
  feedbackType?: 'play' | 'pause' | null;
}

export default function VideoPlayer({ src, poster, isActive, isPaused = false, muted = true, feedbackType = null }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // 如果在加載完畢前用戶點了暫停，立即追回
          if ((window as any).isUserPaused) {
            video.pause();
          }
        }).catch(err => {
          console.log("Play blocked or interrupted", err);
        });
      }
    };

    if (isActive) {
      if (isPaused) {
        // 屬性移除鎖定 (Attribute Locking)
        video.pause();
        video.removeAttribute('autoplay');
        video.muted = true; // 雙重保險
      } else {
        // 恢復播放時重新加入屬性
        video.setAttribute('autoplay', 'true');
        video.muted = muted;
        handlePlay();
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, isPaused, muted]);

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
      
      {/* Play/Pause Feedback Overlay */}
      <AnimatePresence>
        {feedbackType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
              {feedbackType === 'play' ? (
                <Play size={40} className="text-white fill-white ml-1" />
              ) : (
                <Pause size={40} className="text-white fill-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
