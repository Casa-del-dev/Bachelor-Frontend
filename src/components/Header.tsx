import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { HiMenu, HiX, HiUserCircle, HiMoon, HiSun } from "react-icons/hi";
import Logo from "../assets/Peachlab.svg";
import "./Header.css";
import SignUp from "./SignUp";
import Login from "./Login";
import { useAuth } from "../AuthContext";
import Profile from "./Profile";

export function ProfilePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [closingLogin, setClosingLogin] = useState(false);
  const [closingSignUp, setClosingSignUp] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  const triggerCloseLogin = () => {
    setClosingLogin(true);
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setClosingLogin(false);
    }, 300);
  };

  const triggerCloseSignUp = () => {
    setClosingSignUp(true);
    setTimeout(() => {
      setIsSignUpModalOpen(false);
      setClosingSignUp(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLoginModalOpen) triggerCloseLogin();
        if (isSignUpModalOpen) triggerCloseSignUp();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, isSignUpModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isLoginModalOpen &&
        loginRef.current &&
        !loginRef.current.contains(e.target as Node)
      ) {
        triggerCloseLogin();
      }
      if (
        isSignUpModalOpen &&
        signupRef.current &&
        !signupRef.current.contains(e.target as Node)
      ) {
        triggerCloseSignUp();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoginModalOpen, isSignUpModalOpen]);

  return (
    <>
      <Profile
        openLogin={() => setIsLoginModalOpen(true)}
        openSignup={() => setIsSignUpModalOpen(true)}
      />

      {isLoginModalOpen && (
        <div className={`overlay ${closingLogin ? "fade-out" : "fade-in"}`}>
          <div className="overlay-content-login" ref={loginRef}>
            <Login
              setIsLoginModalOpen={triggerCloseLogin}
              setIsModalOpen={setIsSignUpModalOpen}
            />
          </div>
        </div>
      )}

      {isSignUpModalOpen && (
        <div className={`overlay ${closingSignUp ? "fade-out" : "fade-in"}`}>
          <div className="overlay-content" ref={signupRef}>
            <SignUp
              setIsModalOpen={triggerCloseSignUp}
              setIsLoginModalOpen={setIsLoginModalOpen}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [closingHeaderLogin, setClosingHeaderLogin] = useState(false);
  const [closingHeaderSignUp, setClosingHeaderSignUp] = useState(false);
  const headerNavRef = useRef<HTMLDivElement>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, logout } = useAuth();

  const isHomePage = window.location.pathname === "/";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const showIndicator = !isHomePage || menuOpen || hoveredIndex !== null;

  /* --------------------------------------------
  Needed for button animation in header START
  -------------------------------------------- */

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Problems", href: "/problem" },
    { name: "Start", href: "/start" },
    { name: "Building Blocks", href: "/bb" },
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

  // only include “Home” when menu is open:
  const visibleItems = navItems.filter(
    (item) => item.name !== "Home" || menuOpen
  );

  // map the filtered list back to their original indexes
  const visibleOriginalIndexes = navItems
    .map((_, i) => i)
    .filter((i) => navItems[i].name !== "Home" || menuOpen);

  const updateIndicator = (idx: number) => {
    const el = navRefs.current[idx];
    if (!el || !navContainerRef.current) return;
    // compute the offsets relative to the UL container
    const parentRect = navContainerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - parentRect.left - 5,
      top: rect.top - parentRect.top,
      width: rect.width + 10,
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
  }, [hoveredIndex, activeIndex]);

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

  const triggerCloseHeaderSignUp = () => {
    setClosingHeaderSignUp(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setClosingHeaderSignUp(false);
    }, 300);
  };

  const openLoginModal = () => {
    setClosingHeaderLogin(false);
    setIsLoginModalOpen(true);
  };

  const openSignUpModal = () => {
    setClosingHeaderSignUp(false);
    setIsModalOpen(true);
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
    if (isModalOpen || isLoginModalOpen) {
      setProfileDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, isLoginModalOpen]);

  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        triggerCloseHeaderSignUp();
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [isModalOpen]);

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
        if (isModalOpen) triggerCloseHeaderSignUp();
        if (menuOpen) setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, isModalOpen, menuOpen]);

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

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo">
            <img src={Logo} alt="Peachlab Logo" className="logo-image" />
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
                    className={activeIndex === originalIdx ? "active" : ""}
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
                        Login
                      </a>
                    )}
                  </li>
                  <li>
                    <a href="#" onClick={openSignUpModal}>
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className={`overlay`}>
          <div
            className={`overlay-content ${
              closingHeaderSignUp ? "fade-out" : "fade-in"
            }`}
            ref={modalRef}
          >
            <SignUp
              setIsModalOpen={triggerCloseHeaderSignUp}
              setIsLoginModalOpen={openLoginModal}
            />
          </div>
        </div>
      )}
      {isLoginModalOpen && (
        <div className={`overlay`}>
          <div
            className={`overlay-content-login ${
              closingHeaderLogin ? "fade-out" : "fade-in"
            }`}
            ref={loginModalRef}
          >
            <Login
              setIsLoginModalOpen={triggerCloseHeaderLogin}
              setIsModalOpen={openSignUpModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
