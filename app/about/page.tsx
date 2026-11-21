import type { Metadata } from 'next';
import { MotionSection } from '@/components/MotionSection';

export const metadata: Metadata = {
  title: '조직 소개',
  description: 'lazysecure의 활동 방향과 프로젝트 운영 원칙.',
};

export default function AboutPage() {
  return (
    <MotionSection className="space-y-12 pt-8">
      <header className="max-w-3xl space-y-5 border-b border-[#a3a2a5] pb-10">
        <p className="font-mono text-xs text-[#b54b1d]">ABOUT LAZYSECURE</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">조직 소개</h1>
        <p className="text-base leading-8 text-[#555]">
          lazysecure는 한국어 사용자를 중심으로 정보보안 관련 프로젝트를 기획하고,
          기술을 개발하며, 실제 서비스를 운영하는 독립 기술 조직입니다.
        </p>
      </header>
      <section className="grid gap-8 md:grid-cols-[220px_1fr]">
        <h2 className="text-xl font-semibold">활동 분야</h2>
        <div className="max-w-2xl space-y-4 text-sm leading-8 text-[#555]">
          <p>정보보안 관련 콘텐츠와 지식 공유 환경을 만들고, 프로젝트에 필요한 웹 서비스와 인프라를 개발·운영합니다.</p>
          <p>연구 자료를 다루는 프로젝트에서는 자료의 성격과 취급상 주의사항을 구분하고, 제공하는 정보의 출처와 한계를 명확하게 기록하는 것을 중요하게 생각합니다.</p>
        </div>
      </section>
      <section className="grid gap-8 border-t border-[#d8d8d8] pt-8 md:grid-cols-[220px_1fr]">
        <h2 className="text-xl font-semibold">운영 원칙</h2>
        <ul className="max-w-2xl list-disc space-y-3 pl-5 text-sm leading-7 text-[#555]">
          <li>서비스의 목적과 제공 범위를 분명하게 안내합니다.</li>
          <li>실제 기능과 확인 가능한 정보에 기반해 운영합니다.</li>
          <li>각 프로젝트의 성격에 맞는 기술과 운영 방식을 선택합니다.</li>
          <li>한국어를 기본 언어로 제공하고 필요한 경우 영어 정보를 보조적으로 제공합니다.</li>
        </ul>
      </section>
      <section className="grid gap-6 border-t border-[#d8d8d8] pt-8 md:grid-cols-[220px_1fr]">
        <h2 className="text-xl font-semibold">개발자</h2>
        <div className="space-y-3">
          <p className="text-sm leading-7 text-[#555]">프로젝트의 소스 코드와 개발 활동은 공개 GitHub 프로필에서 확인할 수 있습니다.</p>
          <a href="https://github.com/critical-dummy" target="_blank" rel="noopener noreferrer" className="inline-flex border border-[#777] px-4 py-2.5 text-sm font-semibold hover:border-[#b54b1d] hover:bg-[#b54b1d] hover:text-white">개발자 포트폴리오</a>
        </div>
      </section>
    </MotionSection>
  );
}
