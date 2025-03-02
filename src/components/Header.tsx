import { useState } from "react";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi";
import Logo from "../assets/Peachlab_logo.png";
import "./Header.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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

        {/* User Profile Icon */}
        <div className="user-profile">
          <a href="/profile">
            <HiUserCircle />
          </a>
        </div>
      </div>
    </header>
  );
}
