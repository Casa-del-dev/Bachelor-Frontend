import "./Welcome_text.css";
import backgroundImage from "../assets/Welcome_background.webp";
import backgroundImageWhite from "../assets/Welcome_background_white.png";
import { useEffect, useState } from "react";
import { useInView } from "./BuildingBlocks/useInView";
import Reviews from "./BuildingBlocks/Reviews";

export default function Welcome_text({ videoDone }: { videoDone: boolean }) {
  const [welcomeText, setWelcomeText] = useState(false);
  const [showWelcomeContent, setShowWelcomeContent] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );
  const [showBackground1, setShowBackground1] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showSlopeContainers, setShowSlopeContainers] = useState(false);
  const [showReviewBoxes, setShowReviewBoxes] = useState(false);

  const heading = useInView<HTMLHeadingElement>({
    threshold: 0.7,
  });
  const description = useInView<HTMLDivElement>({ threshold: 0.7 });
  const steps = useInView<HTMLDivElement>({ threshold: 0.7 });

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains("dark-mode");
      setTheme(isDark ? "dark" : "light");
    };

    checkDarkMode(); // Run once initially
    const observer = new MutationObserver(checkDarkMode);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoDone) {
      const timeout1 = setTimeout(() => {
        setWelcomeText(true);
      }, 0);

      const timeout2 = setTimeout(() => {
        setShowWelcomeContent(true);
      }, 600);

      const timeout3 = setTimeout(() => {
        setShowBackground1(true);
      }, 1200);

      const timeout4 = setTimeout(() => {
        setShowDetails(true);
      }, 2000);

      const timeout5 = setTimeout(() => {
        setShowSlopeContainers(true);
      }, 2000);

      const timeout6 = setTimeout(() => {
        setShowReviewBoxes(true);
      }, 2600);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
        clearTimeout(timeout6);
      };
    }
  }, [videoDone]);

  const stepTexts = [
    "Identify the problem and desired outcome.",
    "Break the solution into logical steps.",
    "Implement each step incrementally.",
    "Test and verify at each stage.",
    "Refine and optimize your code.",
  ];

  return (
    <section className="welcome-container">
      {/* Hero Section */}
      <div
        className={`welcome-text-background ${welcomeText ? "done" : "undone"}`}
        style={{
          backgroundImage: `url(${
            theme === "light" ? backgroundImageWhite : backgroundImage
          })`,
        }}
      >
        <div
          className={`welcome-text-section ${
            showWelcomeContent ? "visible" : ""
          }`}
        >
          <h1 className="welcome-text-title">
            T E x<sup>T</sup>
          </h1>
          <div className="welcome-text-buttons">
            <button className="getStarted-welcome">
              <a href="/start">Get Started</a>
            </button>
            <span>|</span>
            <button className="tutorial-welcome">Tutorial</button>
          </div>
        </div>
      </div>

      {/* Detailed Text */}
      <div className="details-wrapper">
        {showBackground1 && <div className="background1-slide"></div>}
        <h2
          ref={heading.ref}
          className={`welcome-heading ${
            heading.isIntersecting && showDetails ? "slide-in" : ""
          }`}
        >
          Welcome to the Step Tree Guide
        </h2>
        <div
          ref={description.ref}
          className={`description-welcome ${
            description.isIntersecting && showDetails ? "slide-in" : ""
          }`}
        >
          This page is designed to help beginners develop a structured,
          solution-oriented mindset... This page is designed to help beginners
          develop a structured, solution-oriented mindset...This page is
          designed to help beginners develop a structured, solution-oriented
          mindset...This page is designed to help beginners develop a
          structured, solution-oriented mindset...This page is designed to help
          beginners develop a structured, solution-oriented mindset...This page
          is designed to help beginners develop a structured, solution-oriented
          mindset...This page is designed to help beginners develop a
          structured, solution-oriented mindset...
        </div>
        <div
          ref={steps.ref}
          className={`details-section ${
            steps.isIntersecting && showDetails ? "visible" : ""
          }`}
        >
          <ol className="welcome-steps">
            {stepTexts.map((text, i) => (
              <li
                key={i}
                className={
                  steps.isIntersecting && showDetails ? "slide-in-right" : ""
                }
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {text}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Review Section */}
      <div
        className={`review-section ${
          showSlopeContainers ? "animate-pseudo" : ""
        }`}
      >
        {showReviewBoxes && (
          <div className="container-review-slope-top1 animate-top">
            <div className="review-slope-top1" />
          </div>
        )}

        <Reviews condition={showReviewBoxes} />

        {showReviewBoxes && (
          <div className="container-review-slope-top2 animate-bottom">
            <div className="review-slope-top2" />
          </div>
        )}
      </div>

      {/* Team Section */}
      <div className="team-section fade-in">team</div>

      {/* Footer */}
      <div className="footer-section fade-in">footer</div>
    </section>
  );
}
