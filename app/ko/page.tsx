import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "조직 소개",
  description: "정보보안을 더 쉽게 이해할 수 있도록 돕는 독립 정보보안 조직, lazysecure."
};

const services = [
  {
    no: "01",
    name: "HACKER BLOG",
    category: "보안 미디어",
    description: "보안 뉴스와 기술 해설, 연구 자료를 출처와 맥락을 갖춰 전달합니다.",
    operation: "자료 수집, 중복 확인, 분석, 번역, 검토 단계를 거쳐 콘텐츠를 준비합니다.",
    repo: "https://github.com/lazysecure/hacker-blog",
    tone: "blue"
  },
  {
    no: "02",
    name: "Security Community",
    category: "커뮤니티",
    description: "정보보안에 관심 있는 사람들이 지식과 기술 주제를 나누는 공간입니다.",
    operation: "주제별 토론과 질문을 중심으로 운영하며, 명확한 참여 및 관리 기준을 둡니다.",
    repo: "https://github.com/lazysecure/security-community",
    tone: "orange"
  },
  {
    no: "03",
    name: "Virus Archive",
    category: "위협 정보 참고 자료",
    description: "악성코드 관련 식별자와 역사적 맥락, 방어 목적의 연구 정보를 정리합니다.",
    operation: "실행 파일 배포가 아닌 해시, 탐지명, 분석 요약, 원문 출처 등 비실행형 참고 자료를 중심으로 합니다.",
    repo: "https://github.com/lazysecure/virus-archive",
    tone: "red"
  },
  {
    no: "04",
    name: "Documentation",
    category: "기술 문서",
    description: "lazysecure 프로젝트와 서비스에 관한 기술 문서 및 참고 자료입니다.",
    operation: "프로젝트와 함께 버전 관리되는 문서로 유지합니다.",
    repo: "https://github.com/lazysecure/docs",
    tone: "gray"
  }
];

const principles = [
  ["A", "출처 우선", "주요 정보는 원문 권고문, 연구 자료 등 확인 가능한 출처를 기반으로 합니다."],
  ["B", "명확한 설명", "기술적 주제를 독자가 검토하고 이해할 수 있도록 설명합니다."],
  ["C", "책임 있는 연구", "보안 지식은 이해와 예방, 더 안전한 시스템을 지원해야 합니다."]
];

export default function KoreanHomePage() {
  return (
    <>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> 독립 정보보안 조직</p>
          <h1>보안은 어렵습니다.<br /><span>이해하는 일까지</span><br />어려울 필요는 없습니다.</h1>
          <p className="hero-description">
            lazysecure는 정보보안 관련 정보와 기술 지식, 연구 자료, 커뮤니티 자원을 모아 전달합니다.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#services">서비스 살펴보기 <span aria-hidden="true">→</span></a>
            <a className="text-link" href="https://github.com/lazysecure">GitHub 조직 보기</a>
          </div>
        </div>
        <div className="hero-mark" aria-label="lazysecure 조직 심볼">
          <div className="mark-grid">
            <span className="mark-tile mark-main">l.</span>
            <span className="mark-tile mark-small">LS</span>
            <span className="mark-tile mark-line">INFORMATION<br />SECURITY</span>
            <span className="mark-tile mark-number">01—04</span>
          </div>
          <p>지식 / 연구 / 커뮤니티</p>
        </div>
      </section>

      <section className="services-section section-wrap" id="services">
        <div className="section-heading">
          <div><p className="eyebrow">프로젝트</p><h2>서비스 및 프로젝트</h2></div>
          <p className="section-intro">정보보안을 학습하고, 기록하고, 논의하기 위한 연결된 프로젝트입니다.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className={`service-card tone-${service.tone}`} key={service.no}>
              <div className="card-topline"><span>{service.no} / 04</span><span>{service.category}</span></div>
              <div className="card-symbol" aria-hidden="true">{service.no}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <a href={service.repo} target="_blank" rel="noreferrer">프로젝트 저장소 <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="operations-section" id="operations">
        <div className="section-wrap operations-inner">
          <div className="operations-heading">
            <p className="eyebrow">운영 방식</p>
            <h2>검증 가능한<br />정보를 중심으로.</h2>
            <p>각 프로젝트는 서로 다른 도구를 사용하지만, 출처를 기록하고 맥락을 설명하며 결과를 검토할 수 있게 한다는 원칙을 공유합니다.</p>
          </div>
          <div className="operations-list">
            {services.map((service) => (
              <article className="operation-row" key={service.no}>
                <span className="operation-number">{service.no}</span>
                <div><h3>{service.name}</h3><p>{service.operation}</p></div>
                <span className="operation-arrow" aria-hidden="true">→</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="section-heading">
          <div><p className="eyebrow">조직 소개</p><h2>운영 원칙</h2></div>
          <p className="section-intro">사실, 분석, 불확실성을 구분할 때 정보보안을 더 정확하게 이해할 수 있습니다.</p>
        </div>
        <div className="principle-grid">
          {principles.map(([index, title, body]) => (
            <article className="principle" key={index}><span>{index}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
        <div className="developer-panel">
          <div>
            <p className="eyebrow">개발</p>
            <h3>독립 개발자가 만드는 프로젝트.</h3>
            <p>공개 개발 프로필과 조직의 오픈소스 작업을 확인할 수 있습니다.</p>
          </div>
          <a className="button button-light" href="https://github.com/critical-dummy" target="_blank" rel="noreferrer">개발자 GitHub <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </>
  );
}
