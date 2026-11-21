import { services } from "@/lib/services";

const principles = [
  {
    index: "A",
    title: "Source first",
    body: "Claims should be traceable to original advisories, research, or other reliable references."
  },
  {
    index: "B",
    title: "Clarity over noise",
    body: "Technical subjects should be explained in a way that readers can inspect and understand."
  },
  {
    index: "C",
    title: "Responsible research",
    body: "Security knowledge should support understanding, prevention, and safer systems."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> INDEPENDENT INFORMATION SECURITY</p>
          <h1>Security is difficult.<br /><span>Understanding it</span><br />shouldn&apos;t be.</h1>
          <p className="hero-description">
            lazysecure brings together security information, technical knowledge,
            research references, and community resources.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#services">Explore services <span aria-hidden="true">→</span></a>
            <a className="text-link" href="https://github.com/lazysecure">View organization on GitHub</a>
          </div>
        </div>
        <div className="hero-mark" aria-label="lazysecure organization mark">
          <div className="mark-grid">
            <span className="mark-tile mark-main">l.</span>
            <span className="mark-tile mark-small">LS</span>
            <span className="mark-tile mark-line">INFORMATION<br />SECURITY</span>
            <span className="mark-tile mark-number">01—04</span>
          </div>
          <p>Knowledge / Research / Community</p>
        </div>
      </section>

      <section className="services-section section-wrap" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT WE BUILD</p>
            <h2>Services &amp; projects</h2>
          </div>
          <p className="section-intro">A connected set of projects for learning about, documenting, and discussing information security.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className={`service-card tone-${service.tone}`} key={service.number}>
              <div className="card-topline">
                <span>{service.number} / 04</span>
                <span>{service.category}</span>
              </div>
              <div className="card-symbol" aria-hidden="true">{service.number}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <a href={service.repository} target="_blank" rel="noreferrer">
                Project repository <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="operations-section" id="operations">
        <div className="section-wrap operations-inner">
          <div className="operations-heading">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>Built around<br />traceable information.</h2>
            <p>Our projects use different tools, but share a common operating approach: document the source, explain the context, and make the result reviewable.</p>
          </div>
          <div className="operations-list">
            {services.map((service) => (
              <article className="operation-row" key={service.number}>
                <span className="operation-number">{service.number}</span>
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.operation}</p>
                </div>
                <span className="operation-arrow" aria-hidden="true">→</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ABOUT LAZYSECURE</p>
            <h2>Our principles</h2>
          </div>
          <p className="section-intro">Information security is easier to approach when facts, analysis, and uncertainty are kept distinct.</p>
        </div>
        <div className="principle-grid">
          {principles.map((item) => (
            <article className="principle" key={item.index}>
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="developer-panel">
          <div>
            <p className="eyebrow">DEVELOPMENT</p>
            <h3>Built by an independent developer.</h3>
            <p>Explore the public development profile and the organization&apos;s open-source work.</p>
          </div>
          <a className="button button-light" href="https://github.com/critical-dummy" target="_blank" rel="noreferrer">
            Developer GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
