import { useState, useEffect, useRef } from "react";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi";
import Logo from "../assets/Peachlab_logo.png";
import "./Header.css";
import SignUp from "./SignUp";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, _] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset menuOpen when window width > 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close profile dropdown when clicking outside OR when modal opens
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!profileDropdownRef.current || !(event.target instanceof Node)) {
        return;
      }
      if (!profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    if (isModalOpen) {
      setProfileDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // Close modal when clicking outside of modal content
  useEffect(() => {
    function handleClickOutsideModal(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [isModalOpen]);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
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
          {/* Hamburger Menu */}
          <div className="hamburgers-container">
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX /> : <HiMenu />}
            </div>
          </div>

          {/* User Profile Icon with Dropdown */}
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
                    {isLoggedIn ? (
                      <a href="/logout">Logout</a>
                    ) : (
                      <a href="/login">Login</a>
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

      {/* Sign-Up Modal (Only appears when isModalOpen is true) */}
      {isModalOpen && (
        <div className="overlay">
          <div className="overlay-content">
            {/* Close Button (Handled inside SignUp component) */}
            <SignUp setIsModalOpen={setIsModalOpen} />{" "}
          </div>
        </div>
      )}
    </>
  );
}
