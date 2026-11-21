const navigation = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Operations", href: "#operations" },
  { label: "About", href: "#about" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="lazysecure home">
        <span className="wordmark-mark" aria-hidden="true">l.</span>
        <span>lazysecure</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.label}>{item.label}</a>
        ))}
      </nav>
      <a className="header-link" href="https://github.com/lazysecure">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
