import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#d0d0d0] bg-[#efefed]">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <p className="font-semibold tracking-tight text-[#171717]">lazysecure</p>
          <p className="max-w-xl text-xs leading-6 text-[#666]">한국어 중심의 독립 정보보안 기술 프로젝트 조직</p>
          <p className="font-mono text-[10px] text-[#888]">© {new Date().getFullYear()} lazysecure</p>
        </div>
        <nav aria-label="하단 메뉴" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#555]">
          <Link href="/">홈</Link>
          <Link href="/#services">서비스</Link>
          <Link href="/about">조직 소개</Link>
          <Link href="/contact">문의</Link>
          <a href="https://github.com/lazysecure" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://github.com/critical-dummy" target="_blank" rel="noopener noreferrer">개발자 포트폴리오</a>
        </nav>
      </div>
    </footer>
  );
}
