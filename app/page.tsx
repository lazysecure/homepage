import { MotionSection } from '@/components/MotionSection';

export const metadata = {
  title: '홈',
  description: 'lazysecure — 한국어 중심의 독립 정보보안 기술 프로젝트 조직.',
};

const services = [
  {
    number: '01',
    name: 'HACKER BLOG',
    type: '정보보안 콘텐츠',
    description: '보안 관련 소식과 기술 분석을 정리해 발행하는 정보 채널입니다.',
    operation: '편집·기술 검토를 거친 글 중심으로 운영합니다.',
  },
  {
    number: '02',
    name: '정보보안 커뮤니티',
    type: '커뮤니티',
    description: '정보보안에 관심 있는 사람들이 질문과 지식을 나누는 커뮤니티입니다.',
    operation: '게시판 기반으로 주제별 토론과 정보 공유를 지원합니다.',
  },
  {
    number: '03',
    name: 'Hacker Server',
    type: '인프라',
    description: 'lazysecure의 웹 서비스와 프로젝트를 뒷받침하는 서버 인프라입니다.',
    operation: '각 서비스의 목적과 요구사항에 맞춰 시스템을 구성하고 운영합니다.',
  },
  {
    number: '04',
    name: 'Virus Archive',
    type: '악성코드 아카이브',
    description: '실제 악성코드 샘플과 관련 분석 정보를 보존하는 보안 연구 아카이브입니다.',
    operation: '샘플은 비밀번호로 보호된 ZIP 형식으로 보관하며, 항목별 해시·탐지명·분석 요약·출처 정보를 기록합니다.',
  },
];

export default function HomePage() {
  return (
    <MotionSection className="space-y-20">
      <section className="grid gap-8 border-b border-[#a3a2a5] pb-12 pt-8 md:grid-cols-[minmax(0,1fr)_250px] md:items-end md:gap-16 md:pt-16">
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#b54b1d]">
            Independent information security projects
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-tight text-[#171717] sm:text-5xl md:text-6xl">
            정보보안을 연구하고,
            <br className="hidden sm:block" /> 필요한 기술을 만듭니다.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#505050]">
            lazysecure는 한국어 사용자를 중심으로 정보보안 관련 프로젝트와 서비스를
            기획·개발·운영하는 독립 기술 조직입니다. 지식 공유부터 연구 자료의 보존까지,
            각 프로젝트의 목적에 맞는 형태로 운영합니다.
          </p>
        </div>
        <aside className="border-l-2 border-[#b54b1d] pl-5 text-sm leading-7 text-[#555]">
          <p className="font-mono text-xs text-[#777]">ORGANIZATION</p>
          <p className="mt-2 text-lg font-semibold text-[#171717]">lazysecure</p>
          <p>Information Security</p>
          <p>Republic of Korea</p>
          <p className="mt-3 text-xs text-[#777]">한국어 우선 · English available</p>
        </aside>
      </section>

      <section id="services" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#a3a2a5] pb-4">
          <div>
            <p className="font-mono text-xs text-[#b54b1d]">01 / SERVICES</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">프로젝트 및 서비스</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#666]">
            lazysecure에서 운영하거나 개발 중인 정보보안 관련 프로젝트입니다.
          </p>
        </div>
        <div className="divide-y divide-[#d7d7d7] border-y border-[#d7d7d7]">
          {services.map((service) => (
            <article key={service.number} className="grid gap-5 py-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(220px,0.65fr)_150px] md:gap-7">
              <p className="font-mono text-sm text-[#b54b1d]">{service.number}</p>
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#777]">{service.type}</p>
                <h3 className="text-xl font-semibold tracking-tight text-[#171717]">{service.name}</h3>
                <p className="max-w-xl text-sm leading-7 text-[#555]">{service.description}</p>
              </div>
              <div className="border-l border-[#dedede] pl-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#777]">운영 방식</p>
                <p className="mt-2 text-sm leading-7 text-[#555]">{service.operation}</p>
              </div>
              <div className="flex items-start md:justify-end">
                <span className="inline-flex min-h-10 items-center border border-[#d0d0d0] px-3 text-xs text-[#777]">서비스 안내</span>
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs leading-6 text-[#777]">
          Virus Archive는 실제 악성코드 샘플을 포함하는 연구 자료 아카이브입니다.
          샘플은 비밀번호로 보호된 압축 파일로 보관되며,
          안전한 연구 환경과 관련 주의사항을 전제로 취급해야 합니다.
        </p>
      </section>

      <section className="grid gap-8 border-y border-[#a3a2a5] py-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <p className="font-mono text-xs text-[#b54b1d]">02 / APPROACH</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">프로젝트마다 필요한 방식으로</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#555]">
          <p>모든 서비스를 하나의 제품처럼 포장하지 않습니다. 콘텐츠 서비스, 커뮤니티, 인프라, 연구 자료 아카이브는 서로 다른 목적과 운영 요건을 가집니다.</p>
          <p>각 프로젝트의 기능과 기술 구조를 목적에 맞게 설계하고, 실제로 제공하는 범위와 제한사항을 명확하게 안내하는 것을 지향합니다.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-xs text-[#b54b1d]">03 / DEVELOPMENT</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">개발 및 기술 기록</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#555]">
            서비스 구현과 기술 실험에 관한 소스 코드 및 개발 기록을 공개 저장소에서 확인할 수 있습니다.
          </p>
        </div>
        <a href="https://github.com/critical-dummy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center border border-[#222] px-4 text-sm font-semibold text-[#222] transition-colors hover:bg-[#222] hover:text-white">
          개발자 포트폴리오
          <span aria-hidden="true" className="ml-4">→</span>
        </a>
      </section>
    </MotionSection>
  );
}
