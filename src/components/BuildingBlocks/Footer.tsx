import "./Footer.css";

const Footer = ({ condition }: { condition: boolean }) => {
  return (
    <footer className={`app-footer ${condition ? "faded" : ""}`}>
      <div className="footer-content">
        <p>Bachelor Thesis</p>
        <p>ehomburg@ethz.ch</p>
        <p>&copy; {new Date().getFullYear()} PEACH Lab</p>
      </div>
    </footer>
  );
};

export default Footer;
