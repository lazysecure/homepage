'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { label: '홈', href: '/' },
  { label: '서비스', href: '/#services' },
  { label: '조직 소개', href: '/about' },
  { label: '문의', href: '/contact' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#d8d8d8] bg-[#f8f8f6]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="lazysecure 홈">
          <span className="flex h-9 w-9 items-center justify-center bg-[#b54b1d] font-mono text-sm font-semibold text-white">L</span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-[#171717]">lazysecure</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#777]">Information Security</span>
          </span>
        </Link>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : item.href === '/about' ? pathname === '/about' : item.href === '/contact' ? pathname === '/contact' : false;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`border-b-2 py-2 text-sm transition-colors ${active ? 'border-[#b54b1d] font-semibold text-[#171717]' : 'border-transparent text-[#666] hover:text-[#171717]'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a href="https://github.com/lazysecure" target="_blank" rel="noopener noreferrer" className="hidden border border-[#777] px-3 py-2 text-xs font-semibold text-[#333] transition-colors hover:border-[#b54b1d] hover:bg-[#b54b1d] hover:text-white sm:inline-flex">
          GitHub
        </a>
      </div>
      <nav aria-label="모바일 메뉴" className="flex gap-5 overflow-x-auto border-t border-[#e5e5e5] px-5 py-2.5 text-xs text-[#555] md:hidden">
        {navigation.map((item) => <Link key={item.href} href={item.href} className="shrink-0">{item.label}</Link>)}
        <a href="https://github.com/lazysecure" target="_blank" rel="noopener noreferrer" className="shrink-0">GitHub</a>
      </nav>
    </header>
  );
}
