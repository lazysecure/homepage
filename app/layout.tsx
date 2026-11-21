import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { MetroTransitionProvider } from '@/components/MetroTransitionProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://해커.홈페이지.한국'),
  title: {
    default: 'lazysecure — 정보보안 기술 프로젝트 조직',
    template: '%s | lazysecure',
  },
  description: 'lazysecure는 한국어 사용자를 중심으로 정보보안 관련 프로젝트와 서비스를 기획·개발·운영하는 독립 기술 조직입니다.',
  openGraph: {
    title: 'lazysecure',
    description: '한국어 중심의 독립 정보보안 기술 프로젝트 조직',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-[#f8f8f6] font-sans text-[#171717] antialiased">
        <MetroTransitionProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-[1180px] flex-1 overflow-x-clip px-5 py-8 sm:px-8 sm:py-10">
            {children}
          </main>
          <SiteFooter />
        </MetroTransitionProvider>
      </body>
    </html>
  );
}
