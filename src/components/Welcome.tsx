import { useEffect, useRef, useState } from "react";
import "./Welcome.css";
import VideoSrc from "../assets/VideoClip.mp4";
import Welcome_text from "./Welcome_text";

export default function Welcome() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  //used for header
  useEffect(() => {
    if (!videoDone) {
      document.body.classList.add("video-playing");
    } else {
      document.body.classList.remove("video-playing");
    }
    return () => {
      document.body.classList.remove("video-playing");
    };
  }, [videoDone]);

  useEffect(() => {
    if (!videoDone) {
      document.body.style.overflow = "hidden";
      return;
    }

    // Delay scroll unlock by 1s
    const timeout = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 1000);

    return () => clearTimeout(timeout);
  }, [videoDone]);

  useEffect(() => {
    if (videoDone) return;

    const onScrollGesture = (e: Event) => {
      if (!videoDone && !isUnlocked) {
        e.preventDefault();
        setVideoDone(true);
        cleanup();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        "Space",
      ];
      if (keys.includes(e.code)) {
        e.preventDefault();
        handleVideoEnd();
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener("wheel", onScrollGesture);
      window.removeEventListener("touchmove", onScrollGesture);
      window.removeEventListener("scroll", onScrollGesture);
      window.removeEventListener("keydown", onKeyDown);
    };

    window.addEventListener("wheel", onScrollGesture, { passive: false });
    window.addEventListener("touchmove", onScrollGesture, { passive: false });
    window.addEventListener("scroll", onScrollGesture, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });

    return cleanup;
  }, [videoDone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setVideoReady(true);
    };
    video.addEventListener("canplaythrough", onLoaded);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (!video || isUnlocked) return;

    video.pause();

    const onSeeked = () => {
      /*       const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(video, 0, 0); */

      setIsUnlocked(true);

      setVideoDone(true);
      video.removeEventListener("seeked", onSeeked);
    };

    video.addEventListener("seeked", onSeeked);
    requestAnimationFrame(() => {
      video.currentTime = video.duration;
    });
  };

  return (
    <div className="welcome-root">
      {/* show video until we flip */}
      {!videoDone && (
        <video
          ref={videoRef}
          className={`welcome-hero ${videoReady ? "fade-in-hero" : ""}`}
          src={VideoSrc}
          muted
          playsInline
          autoPlay
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          onEnded={handleVideoEnd}
          onError={() => console.error("Failed to load video")}
        />
      )}

      {videoReady && (
        <main
          className="welcome-content"
          style={{ maxHeight: videoDone ? "none" : "0" }}
        >
          <Welcome_text videoDone={videoDone} />
        </main>
      )}
    </div>
  );
}
