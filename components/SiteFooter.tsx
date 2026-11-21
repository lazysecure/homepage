import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[#f2f2f3] text-[#18181b]">
      <div
        className={cn(
          'mx-auto flex flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6',
          siteConfig.layout.maxWidthClass
        )}
      >
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold text-[#18181b]">
            {siteConfig.identity.handle}
          </p>
          <p className="text-xs text-[#52525b]">
            Public repository and profile data served via the GitHub REST API.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#52525b]"
        >
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#18181b] whitespace-nowrap"
            >
              {item.label.toLowerCase()}
            </Link>
          ))}
          <a
            href={siteConfig.identity.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#c2410c] transition-colors hover:text-[#18181b] whitespace-nowrap"
          >
            github
          </a>
        </nav>
      </div>
    </footer>
  );
}
