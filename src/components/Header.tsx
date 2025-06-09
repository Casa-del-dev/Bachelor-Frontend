import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  HiMenu,
  HiX,
  HiUserCircle,
  HiMoon,
  HiSun,
  HiInformationCircle,
} from "react-icons/hi";
import Logo from "../assets/Peachlab.svg";
import "./Header.css";
import Login from "./Login";
import { useAuth } from "../AuthContext";
import Profile from "./Profile";
import WhiteLogo from "../assets/PeachLogoWhite.svg";
import { InfoWithTooltip } from "./BuildingBlocks/InformationToolTip";

export function ProfilePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [closingHeaderLogin, setClosingHeaderLogin] = useState(false);
  const loginModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLoginModalOpen) triggerCloseHeaderLogin();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen]);

  useEffect(() => {
    const handleClickOutsideLogin = (e: MouseEvent) => {
      if (
        loginModalRef.current &&
        !loginModalRef.current.contains(e.target as Node)
      ) {
        triggerCloseHeaderLogin();
      }
    };
    if (isLoginModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideLogin);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideLogin);
  }, [isLoginModalOpen]);

  const triggerCloseHeaderLogin = () => {
    setClosingHeaderLogin(true);
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setClosingHeaderLogin(false);
    }, 300);
  };

  const openLoginModal = () => {
    setClosingHeaderLogin(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <Profile openLogin={() => setIsLoginModalOpen(true)} />

      {isLoginModalOpen && (
        <div className={`overlay`}>
          <div
            className={`overlay-content-login ${
              closingHeaderLogin ? "fade-out" : "fade-in"
            }`}
            ref={loginModalRef}
          >
            <Login
              setIsLoginModalOpen={
                isLoginModalOpen ? triggerCloseHeaderLogin : openLoginModal
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [closingHeaderLogin, setClosingHeaderLogin] = useState(false);
  const headerNavRef = useRef<HTMLDivElement>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, logout } = useAuth();

  const contentPaths = ["/problem", "/start", "/abstract"];
  const path = window.location.pathname;
  const isContentPage = contentPaths.some((p) => path.startsWith(p));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const showIndicator = menuOpen || hoveredIndex !== null || isContentPage;
  const [showHome, setShowHome] = useState(false);

  /* --------------------------------------------
  Needed for button animation in header START
  -------------------------------------------- */
  useEffect(() => {
    if (menuOpen) {
      setShowHome(true);
    } else {
      const timeout = setTimeout(() => {
        setShowHome(false);
      }, 300); // or whatever delay matches your menu close animation
      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Problems", href: "/problem" },
    { name: "Start", href: "/start" },
    { name: "Abstract", href: "/abstract" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const navContainerRef = useRef<HTMLUListElement>(null);
  const navRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const path = window.location.pathname;
    // strip trailing slash (but keep "/" for homepage)
    const cleanPath =
      path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

    const idx = navItems.findIndex((item) => {
      if (item.href === "/") {
        return cleanPath === "/";
      }
      return cleanPath.startsWith(item.href);
    });

    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, []);

  const visibleItems = navItems.filter(
    (item) => item.name !== "Home" || showHome
  );

  // map the filtered list back to their original indexes
  const visibleOriginalIndexes = navItems
    .map((_, i) => i)
    .filter((i) => navItems[i].name !== "Home" || showHome);

  const updateIndicator = (idx: number) => {
    const el = navRefs.current[idx];
    if (!el || !navContainerRef.current) return;
    // compute the offsets relative to the UL container
    const parentRect = navContainerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - parentRect.left - 10,
      top: rect.top - parentRect.top,
      width: rect.width + 20,
      height: rect.height,
    });
  };

  // initialize on mount & whenever menu toggles
  useLayoutEffect(() => {
    updateIndicator(activeIndex);
  }, [activeIndex, menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator(hoveredIndex ?? activeIndex);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hoveredIndex, activeIndex, menuOpen]);

  /* --------------------------------------------
  Needed for button animation in header END
  -------------------------------------------- */

  const triggerCloseHeaderLogin = () => {
    setClosingHeaderLogin(true);
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setClosingHeaderLogin(false);
    }, 300);
  };

  const openLoginModal = () => {
    setClosingHeaderLogin(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoginModalOpen]);

  useEffect(() => {
    const handleClickOutsideMenu = (e: MouseEvent) => {
      if (
        menuOpen &&
        headerNavRef.current &&
        !headerNavRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutsideLogin = (e: MouseEvent) => {
      if (
        loginModalRef.current &&
        !loginModalRef.current.contains(e.target as Node)
      ) {
        triggerCloseHeaderLogin();
      }
    };
    if (isLoginModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideLogin);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideLogin);
  }, [isLoginModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLoginModalOpen) triggerCloseHeaderLogin();
        if (menuOpen) setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, menuOpen]);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      window.dispatchEvent(new Event("storage"));
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const tooltips: Record<string, string> = {
    Problems: "Browse and select coding problems to solve in this section.",
    Start:
      "Start solving problems right away. Use the Decomposition Box to organize your thoughts, break down the problem, and strengthen your problem-solving skills as a coder.",
    Abstract:
      "Refine your code using generalization techniques commonly practiced in the coding community.",
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo">
            {!isDarkMode ? (
              <img src={Logo} alt="Peachlab Logo" className="logo-image" />
            ) : (
              <img src={WhiteLogo} alt="Peachlab Logo" className="logo-image" />
            )}
          </a>
        </div>

        <nav
          ref={headerNavRef}
          className={`header-nav ${menuOpen ? "show" : ""}`}
        >
          <ul
            ref={navContainerRef}
            className={`nav-links ${menuOpen ? "show" : ""}`}
            onMouseLeave={() => {
              setHoveredIndex(null);
              updateIndicator(activeIndex);
            }}
          >
            {/* only render the little box when showIndicator===true */}
            {showIndicator && (
              <div
                className="indicator"
                style={{
                  left: indicator.left,
                  top: indicator.top,
                  width: indicator.width,
                  height: indicator.height,
                }}
              />
            )}

            {visibleItems.map((item, visibleIdx) => {
              const originalIdx = visibleOriginalIndexes[visibleIdx];
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`linksToDifferentPages ${
                      activeIndex === originalIdx ? "active" : ""
                    }`}
                    ref={(el) => {
                      navRefs.current[originalIdx] = el;
                    }}
                    onMouseEnter={() => {
                      setHoveredIndex(originalIdx);
                      updateIndicator(originalIdx);
                    }}
                    onClick={() => {
                      setHoveredIndex(null);
                      setActiveIndex(originalIdx);
                    }}
                  >
                    {item.name}
                    {item.name !== "Home" && (
                      <InfoWithTooltip
                        tooltip={tooltips[item.name] || "More info"}
                      >
                        <HiInformationCircle className="info-icon" />
                      </InfoWithTooltip>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="container-for-besties">
          <div className="hamburgers-container">
            <div className="darkmode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <HiSun /> : <HiMoon />}
            </div>
            <div
              className="hamburger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </div>
          </div>

          <div className="user-profile" ref={profileDropdownRef}>
            <div className="profile-icon" onClick={toggleProfileDropdown}>
              <HiUserCircle />
            </div>
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <ul>
                  <li>
                    <a href="/profile">Profile</a>
                  </li>
                  <li>
                    {isAuthenticated ? (
                      <a href="#" onClick={logout}>
                        Logout
                      </a>
                    ) : (
                      <a href="#" onClick={openLoginModal}>
                        Log In
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      {isLoginModalOpen && (
        <div className={`overlay`}>
          <div
            className={`overlay-content-login ${
              closingHeaderLogin ? "fade-out" : "fade-in"
            }`}
            ref={loginModalRef}
          >
            <Login setIsLoginModalOpen={triggerCloseHeaderLogin} />
          </div>
        </div>
      )}
    </>
  );
}
