// Reviews.tsx
import { useState, useEffect, useRef } from "react";
import "./Reviews.css";
import { useInView } from "./useInView";
import TruncatedComment from "./TruncateComment";

//
// 1) Define the “hard-coded” fallback list (same shape as backend reviews).
//
interface Review {
  username: string;
  rating: number; // a number between 0–5
  message: string; // the text of the review
}

const DEFAULT_REVIEWS: Review[] = [
  { username: "JohnDoe", rating: 5, message: "Great app, really intuitive!" },
  {
    username: "JaneSmith",
    rating: 4,
    message: "Helped me plan my solution perfectly.",
  },
  {
    username: "AlexRay",
    rating: 5,
    message:
      "Super smooth experience. A+++++++++++++ +++++++++++++++++++++++ ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  },
  {
    username: "ChrisP",
    rating: 4,
    message: "Made me think in steps, not in chaos.",
  },
  { username: "MaryL", rating: 5, message: "Better than flowcharts." },
  { username: "DevFan", rating: 3, message: "6 reviews." },
];

const Reviews = ({ condition }: { condition: boolean }) => {
  const reviewsRef = useInView<HTMLDivElement>({ threshold: 0.7 });
  const trackRef = useRef<HTMLDivElement>(null);

  // state to hold exactly 6 reviews (picked randomly + filled with defaults if needed)
  const [displayReviews, setDisplayReviews] = useState<Review[]>([]);
  // state for the “duplicated” set that we actually scroll
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  //
  // 2) On mount, fetch from the backend, pick 6 at random, then fill with defaults if fewer than 6 returned.
  //
  useEffect(() => {
    async function fetchAndPickReviews() {
      try {
        const res = await fetch(
          "https://bachelor-backend.erenhomburg.workers.dev/review/v1/all",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          console.error("Failed to load reviews:", res.status);
          // If backend fails, just fall back to defaults right away
          setDisplayReviews(DEFAULT_REVIEWS.slice(0, 6));
          return;
        }

        // assume backend returns Review[]
        const data = (await res.json()) as Review[];

        // 2a) Shuffle “data” in-place (Fisher-Yates or simple sort trick—fine for small arrays)
        const shuffled = data
          .map((r) => ({ ...r })) // clone so we don’t mutate original
          .sort(() => Math.random() - 0.5);

        // 2b) Take up to 6 from shuffled
        let picked = shuffled.slice(0, 6);

        // 2c) If there weren’t enough, fill from DEFAULT_REVIEWS
        if (picked.length < 6) {
          const needed = 6 - picked.length;
          // Just grab the first `needed` defaults
          picked = picked.concat(DEFAULT_REVIEWS.slice(0, needed));
        }

        setDisplayReviews(picked);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        // fallback to defaults if network/JSON fails
        setDisplayReviews(DEFAULT_REVIEWS.slice(0, 6));
      }
    }

    fetchAndPickReviews();
  }, []);

  //
  // 3) Whenever “displayReviews” is set (6 items), duplicate it so we can scroll endlessly.
  //
  useEffect(() => {
    if (displayReviews.length > 0) {
      setActiveReviews([...displayReviews, ...displayReviews]);
      setCurrentPosition(0);
    } else {
      setActiveReviews([]);
    }
  }, [displayReviews]);

  //
  // 4) Marquee animation: move `currentPosition` forward and wrap at half the scrollWidth.
  //
  useEffect(() => {
    if (!reviewsRef.isIntersecting) return;

    const speed = 50; // pixels per second
    let rafId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setCurrentPosition((prev) => {
        if (!trackRef.current) return prev;
        const fullWidth = trackRef.current.scrollWidth;
        const halfWidth = fullWidth / 2;
        const advance = (speed * deltaTime) / 1000;
        const next = prev + advance;
        // wrap when we've scrolled half the duplicated width
        return next >= halfWidth ? 0 : next;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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
              <div
                key={`review-${i}`}
                className={`review-box ${
                  review.rating === 5 ? "five-stars" : ""
                }`}
              >
                <div className="review-username">{review.username}</div>
                <div className="review-stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`star ${
                        index < review.rating ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="review-comment">
                  <TruncatedComment text={review.message} maxLines={2} />
                </div>
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
