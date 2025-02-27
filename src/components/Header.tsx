import Logo from "../assets/Peachlab_logo.png";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="logo">
          <img src={Logo} alt="Peachlab Logo" className="logo-image" />
        </a>
      </div>
      <nav className="header-nav">
        <ul className="nav-links">
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
      <div className="header-end"></div>
    </header>
  );
}
