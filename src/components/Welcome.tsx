import { useEffect, useRef, useState } from "react";
import "./Welcome.css";
import VideoSrc from "../assets/short_clip.mp4";
import Welcome_text from "./Welcome_text";

export default function Welcome() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollPauseRef = useRef<number>(0);
  const lastTouchY = useRef<number | null>(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoReadybefore, setVideoReadyBefore] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  const MAX_PLAYBACK_RATE = 6;
  const SCROLL_PLAY_RATE = 0.04;
  const SCROLL_REWIND_RATE = 0.08;

  useEffect(() => {
    document.body.style.overflow = isUnlocked ? "auto" : "hidden";
  }, [isUnlocked]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setVideoReadyBefore(true);
      setTimeout(() => {
        setVideoReady(true);
      }, 3000);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    // Ensure we wait for the seek to the final frame
    const onSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      setIsUnlocked(true);

      setTimeout(() => {
        setVideoDone(true);
      }, 300);

      video.removeEventListener("seeked", onSeeked);
    };

    video.addEventListener("seeked", onSeeked);
    video.currentTime = video.duration;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isUnlocked) return;

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (lastTouchY.current === null) return;

      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;

      clearTimeout(scrollPauseRef.current);

      if (deltaY > 0) {
        video.playbackRate = Math.min(
          deltaY * SCROLL_PLAY_RATE,
          MAX_PLAYBACK_RATE
        );
        video.play();
      } else {
        video.pause();
        const rewind = Math.min(-deltaY * SCROLL_REWIND_RATE, video.duration);
        video.currentTime = Math.max(0, video.currentTime - rewind);
      }

      scrollPauseRef.current = window.setTimeout(() => {
        video.pause();
        video.playbackRate = 1;
      }, 150);
    };

    const onTouchEnd = () => {
      lastTouchY.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });

    const onWheelScroll = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(scrollPauseRef.current);

      if (e.deltaY > 0) {
        video.playbackRate = Math.min(
          e.deltaY * SCROLL_PLAY_RATE,
          MAX_PLAYBACK_RATE
        );
        video.play();
      } else {
        video.pause();
        const rewind = Math.min(-e.deltaY * SCROLL_REWIND_RATE, video.duration);
        video.currentTime = Math.max(0, video.currentTime - rewind);
      }

      scrollPauseRef.current = window.setTimeout(() => {
        video.pause();
        video.playbackRate = 1;
      }, 150);
    };

    window.addEventListener("wheel", onWheelScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheelScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      clearTimeout(scrollPauseRef.current);
    };
  }, [isUnlocked]);

  return (
    <div className="welcome-root">
      {!isUnlocked && (
        <video
          ref={videoRef}
          className={`welcome-hero ${videoReadybefore ? "fade-in-hero" : ""}`}
          muted
          playsInline
          preload="auto"
          src={VideoSrc}
          onEnded={handleVideoEnd}
          onError={() => console.error("Failed to load video")}
        />
      )}

      {videoReady && (
        <main className="welcome-content">
          <Welcome_text videoDone={videoDone} />
        </main>
      )}
    </div>
  );
}
