import { useState, useEffect, useRef } from "react";
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

  return (
    <>
      <Profile
        openLogin={() => setIsLoginModalOpen(true)}
        openSignup={() => setIsSignUpModalOpen(true)}
      />

      {isLoginModalOpen && (
        <div className="overlay">
          <div className="overlay-content-login">
            <Login
              setIsLoginModalOpen={setIsLoginModalOpen}
              setIsModalOpen={setIsSignUpModalOpen}
            />
          </div>
        </div>
      )}

      {isSignUpModalOpen && (
        <div className="overlay">
          <div className="overlay-content">
            <SignUp
              setIsModalOpen={setIsSignUpModalOpen}
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

  // Dark mode state: init from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, logout } = useAuth();

  // reset menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // close profile dropdown when clicking outside or when any modal opens
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

  // close sign-up modal when clicking outside it
  useEffect(() => {
    const handleClickOutsideModal = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [isModalOpen]);

  // apply dark-mode class on body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      window.dispatchEvent(new Event("storage"));
      return next;
    });
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo">
            <img src={Logo} alt="Peachlab Logo" className="logo-image" />
          </a>
        </div>

        {/* Navigation / Dropdown */}
        <nav className={`header-nav ${menuOpen ? "show" : ""}`}>
          <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
            <li>
              <a href="/problem">Problems</a>
            </li>
            <li>
              <a href="/start">Start</a>
            </li>
            <li>
              <a href="/bb">Building Blocks</a>
            </li>
          </ul>
        </nav>

        <div className="container-for-besties">
          {/* Hamburger + Dark/Light toggle */}
          <div className="hamburgers-container">
            <div
              className="hamburger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </div>

            <div
              className="darkmode-toggle"
              onClick={toggleDarkMode}
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <HiSun /> : <HiMoon />}
            </div>
          </div>

          {/* User Profile Icon */}
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
                      <a href="#" onClick={() => setIsLoginModalOpen(true)}>
                        Login
                      </a>
                    )}
                  </li>
                  <li>
                    <a href="#" onClick={() => setIsModalOpen(true)}>
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {isModalOpen && (
        <div className="overlay">
          <div className="overlay-content" ref={modalRef}>
            <SignUp
              setIsModalOpen={setIsModalOpen}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
          </div>
        </div>
      )}
      {isLoginModalOpen && (
        <div className="overlay">
          <div className="overlay-content-login">
            <Login
              setIsLoginModalOpen={setIsLoginModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
      )}
    </>
  );
}
