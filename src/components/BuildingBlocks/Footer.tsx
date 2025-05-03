import "./Footer.css";

const Footer = ({ condition }: { condition: boolean }) => {
  return (
    <footer className={`app-footer ${condition ? "faded" : ""}`}>
      <div className="footer-content">
        <p>Bachelor Thesis</p>
        <p>&copy; {new Date().getFullYear()} PEACH Lab</p>
        <p>ehomburg@ethz.ch</p>
      </div>
    </footer>
  );
};

export default Footer;
