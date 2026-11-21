export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-wordmark" href="#home">lazysecure</a>
      <p>Making information security easier to understand.</p>
      <div className="footer-meta">
        <span>Independent information security organization</span>
        <a href="https://github.com/lazysecure">GitHub organization</a>
        <span>© {new Date().getFullYear()} lazysecure</span>
      </div>
    </footer>
  );
}
