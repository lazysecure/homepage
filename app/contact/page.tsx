import type { Metadata } from 'next';
import { MotionSection } from '@/components/MotionSection';

export const metadata: Metadata = {
  title: '문의',
  description: 'lazysecure 프로젝트 및 공개 개발 정보.',
};

export default function ContactPage() {
  return (
    <MotionSection className="space-y-10 pt-8">
      <header className="max-w-3xl space-y-5 border-b border-[#a3a2a5] pb-10">
        <p className="font-mono text-xs text-[#b54b1d]">CONTACT</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">문의 및 공개 정보</h1>
        <p className="text-base leading-8 text-[#555]">
          lazysecure의 프로젝트와 개발 현황은 공개 저장소를 통해 확인할 수 있습니다.
          문의 창구와 서비스별 안내는 각 프로젝트 페이지를 기준으로 확인해 주세요.
        </p>
      </header>
      <div className="divide-y divide-[#d8d8d8] border-y border-[#d8d8d8]">
        <div className="grid gap-2 py-6 sm:grid-cols-[200px_1fr]">
          <h2 className="font-semibold">lazysecure GitHub</h2>
          <a href="https://github.com/lazysecure" target="_blank" rel="noopener noreferrer" className="text-sm text-[#9b3e18] underline underline-offset-4">github.com/lazysecure</a>
        </div>
        <div className="grid gap-2 py-6 sm:grid-cols-[200px_1fr]">
          <h2 className="font-semibold">개발자 포트폴리오</h2>
          <a href="https://github.com/critical-dummy" target="_blank" rel="noopener noreferrer" className="text-sm text-[#9b3e18] underline underline-offset-4">github.com/critical-dummy</a>
        </div>
      </div>
    </MotionSection>
  );
}
