import { useState, useEffect, useRef } from "react";
import "./Reviews.css";
import { useInView } from "./useInView";

const reviews = [
  { username: "JohnDoe", star: 5, comment: "Great app, really intuitive!" },
  {
    username: "JaneSmith",
    star: 4,
    comment: "Helped me plan my solution perfectly.",
  },
  { username: "AlexRay", star: 5, comment: "Super smooth experience. A++" },
  {
    username: "ChrisP",
    star: 4,
    comment: "Made me think in steps, not in chaos.",
  },
  { username: "MaryL", star: 5, comment: "Better than flowcharts." },
  { username: "DevFan", star: 3, comment: "6 reviews." },
];

const Reviews = ({ condition }: { condition: boolean }) => {
  const reviewsRef = useInView<HTMLDivElement>({ threshold: 0.7 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [activeReviews, _] = useState([...reviews, ...reviews]);

  useEffect(() => {
    if (!reviewsRef.isIntersecting) return;

    const speed = 50; // pixels per second - adjust for desired speed
    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setCurrentPosition((prev) => {
        const newPosition = prev + (speed * deltaTime) / 1000;

        // When we've scrolled one full set of reviews, reset position
        if (newPosition >= trackRef.current?.scrollWidth! / 2) {
          return 0;
        }
        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reviewsRef.isIntersecting]);

  return (
    <div
      ref={reviewsRef.ref}
      className={`review-section2 ${
        reviewsRef.isIntersecting && condition ? "fade-in-rev" : ""
      }`}
    >
      <div className="review-marquee-container">
        <div className="edge-fade left-fade"></div>

        <div className="review-marquee">
          <div
            className="review-track"
            ref={trackRef}
            style={{ transform: `translateX(-${currentPosition}px)` }}
          >
            {activeReviews.map((review, i) => (
              <div key={`review-${i}`} className="review-box">
                <div className="review-username">{review.username}</div>
                <div className="review-stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`star ${index < review.star ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="edge-fade right-fade"></div>
      </div>
    </div>
  );
};

export default Reviews;
