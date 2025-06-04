import "./Welcome_text.css";
import backgroundImage from "../assets/Welcome_background.webp";
import backgroundImageWhite from "../assets/Welcome_background_white.png";
import { useEffect, useState } from "react";
import { useInView } from "./BuildingBlocks/useInView";
import Reviews from "./BuildingBlocks/Reviews";
import Team from "./BuildingBlocks/Team";
import Footer from "./BuildingBlocks/Footer";

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
  const [showTeam, setShowTeam] = useState(false);
  const [showFooter, setFooter] = useState(false);

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

      const timeout7 = setTimeout(() => {
        setShowTeam(true);
      }, 3200);

      const timeout8 = setTimeout(() => {
        setFooter(true);
      }, 3800);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
        clearTimeout(timeout5);
        clearTimeout(timeout6);
        clearTimeout(timeout7);
        clearTimeout(timeout8);
      };
    }
  }, [videoDone]);

  const stepTexts = [
    "Beginner-Friendly Focus",
    "Problem Decomposition Support",
    "Guidance Without Giving Answers",
    "Learning Curve Improvement",
    "Thoughtful UX Design (via animation logic)",
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
          <h1 className="welcome-text-title">Decomposition Box</h1>
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
          Welcome to Decomposition Box!
        </h2>
        <div
          ref={description.ref}
          className={`description-welcome ${
            description.isIntersecting && showDetails ? "slide-in" : ""
          }`}
        >
          Struggling to solve coding problems as a beginner? You're not alone.
          Many students find it hard to spot edge cases, understand the full
          scope of a problem, or simply get stuck halfway through.
          <br />
          <br />
          <strong>Decomposition Box</strong> is here to help.
          <br />
          This platform guides early-stage learners in building their own
          autonomous coding solutions by breaking complex problems into
          manageable steps— with the support of a powerful language model (LLM).
          <br />
          <br />
          By organizing your thoughts step-by-step, you gain a clearer path to
          your solution. This approach not only improves your problem-solving
          efficiency, but also builds stronger computational thinking skills
          over time.
          <br />
          <br />
          Start thinking like a developer—one step at a time.
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
      <Team condition={showTeam} />
      {/* Footer */}
      <Footer condition={showFooter} />
    </section>
  );
}
