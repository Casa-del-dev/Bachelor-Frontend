import { useEffect, useRef, useState } from "react";
import "./Welcome.css";
import VideoSrc from "../assets/short_clip.mp4";
import photo from "../assets/Juppie.jpg";

export default function Welcome() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const scrollPauseTimeout = useRef<number>(0);

  const [finalImage, setFinalImage] = useState<string | null>(null);

  const MAX_RATE = 6; // maximum playback rate (6× speed)
  const SCROLL_TO_RATE = 0.04; // how much speed per deltaY when scrolling forward
  const SCROLL_TO_REWIND = 0.08; // how many seconds to rewind per negative deltaY

  useEffect(() => {
    document.body.style.overflow = unlocked ? "auto" : "hidden";
  }, [unlocked]);

  const onEnded = () => {
    const vid = videoRef.current;
    if (!vid) return;

    // Draw the final frame to canvas
    const canvas = document.createElement("canvas");
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      setFinalImage(dataURL);
      setUnlocked(true);
    }
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleWheel = (e: WheelEvent) => {
      if (unlocked) return;
      e.preventDefault();

      clearTimeout(scrollPauseTimeout.current);

      if (e.deltaY > 0) {
        // → FORWARD SCROLL: map deltaY to playbackRate
        // e.deltaY might be ~100 on a fast scroll,
        // so we scale it down to, say, a max of 5× speed:
        const rate = Math.min(e.deltaY * SCROLL_TO_RATE, MAX_RATE);
        vid.playbackRate = rate;
        vid.play();
      } else {
        // ← BACKWARD SCROLL: pause and scrub backwards
        vid.pause();
        // map deltaY to a rewind jump (in seconds)
        const jump = Math.min(-e.deltaY * SCROLL_TO_REWIND, vid.duration);
        vid.currentTime = Math.max(0, vid.currentTime - jump);
      }

      // when scrolling stops for 150ms, pause the video
      scrollPauseTimeout.current = window.setTimeout(() => {
        vid.pause();
        vid.playbackRate = 1;
      }, 150);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(scrollPauseTimeout.current);
    };
  }, [unlocked]);

  return (
    <div>
      {/* full-screen video hero */}
      {!unlocked && (
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
          src={VideoSrc}
          onEnded={onEnded}
          onError={() => console.error("Video failed to load")}
        />
      )}

      {unlocked && finalImage && (
        <img src={finalImage} className="hero-image" alt="Final Frame" />
      )}

      <div className="page-content">
        <div className="container-fluid-welcome">
          <div className="body-1">
            <div className="First-div">
              <img src={photo} alt="Small Thumbnail" />
              <div className="First-text">Welcome!</div>
            </div>
          </div>
          <div className="body-2">
            <div className="Second-div">
              <div className="Second-text">Welcome!</div>
              <img src={photo} alt="Small Thumbnail" />
            </div>
          </div>
          <div className="body-1">
            <div className="Third-div">
              <img src={photo} alt="Small Thumbnail" />
              <div className="Third-text">Welcome!</div>
            </div>
          </div>
          <div className="body-2">
            <div className="Fourth-div">
              <div className="Fourth-text">Welcome!</div>
              <img src={photo} alt="Small Thumbnail" />
            </div>
          </div>
        </div>

        <div className="container-review">
          <hr />
        </div>
      </div>
    </div>
  );
}
