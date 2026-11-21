'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { MetroIcon } from '@/components/MetroIcon';
import { siteConfig } from '@/config/site';
import {
  METRO_EASE,
  METRO_PIVOT_INDICATOR_DURATION,
} from '@/lib/navigation-motion';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const mobileOpen = openPathname === pathname;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPathname(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div
        className={cn(
          'mx-auto flex h-16 items-center justify-between gap-8 px-4 sm:px-6',
          siteConfig.layout.maxWidthClass
        )}
      >
        {/* Zone 1: Metro workspace title */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-[#18181b] transition-colors hover:text-[#ea580c] whitespace-nowrap shrink-0"
        >
          {siteConfig.identity.handle}
        </Link>

        {/* Zone 2: Official Metro Pivot navigation (active dark, inactive muted, lowercase) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-baseline gap-7"
        >
          {siteConfig.navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-lg font-light tracking-tight transition-colors whitespace-nowrap shrink-0',
                  active
                    ? 'font-normal text-[#18181b]'
                    : 'text-[#737276] hover:text-[#18181b]'
                )}
              >
                {item.label.toLowerCase()}
                {active && (
                  <motion.span
                    layoutId="metro-pivot-indicator"
                    aria-hidden="true"
                    transition={{
                      duration: METRO_PIVOT_INDICATOR_DURATION,
                      ease: METRO_EASE,
                    }}
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ea580c]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Official Metro 2px outline action button + mobile trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={siteConfig.identity.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 border-2 border-[#18181b] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white whitespace-nowrap shrink-0"
          >
            <MetroIcon name="github" className="text-[13px]" />
            <span>GitHub</span>
            <MetroIcon name="arrow-up-right" className="text-[11px]" />
          </a>

          <button
            type="button"
            onClick={() =>
              setOpenPathname((prev) => (prev === pathname ? null : pathname))
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center bg-[#f2f2f3] text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white md:hidden shrink-0"
          >
            {mobileOpen ? (
              <MetroIcon name="cross" className="text-[14px]" />
            ) : (
              <MetroIcon name="menu" className="text-[16px]" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.nav
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: METRO_EASE }}
            className="bg-[#18181b] px-4 py-4 text-white md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenPathname(null)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[44px] items-center justify-between px-3 py-2 text-lg font-light transition-colors',
                        active
                          ? 'bg-[#c2410c] font-normal text-white'
                          : 'text-[#d4d4d8] hover:bg-[#27272a] hover:text-white'
                      )}
                    >
                      <span>{item.label.toLowerCase()}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <a
                  href={siteConfig.identity.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center justify-between border-2 border-white px-3 py-2 text-sm font-semibold text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <MetroIcon name="github" className="text-[15px]" />
                    <span>GitHub Profile</span>
                  </span>
                  <MetroIcon name="arrow-up-right" className="text-[13px]" />
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
