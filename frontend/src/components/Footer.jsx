const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <p>© {year} Movie Manager. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy" className="footer-link">
            Privacy
          </a>
          <a href="/terms" className="footer-link">
            Terms
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
