import type { Metadata } from 'next';
import { IBM_Plex_Mono, Open_Sans } from 'next/font/google';
import { MetroTransitionProvider } from '@/components/MetroTransitionProvider';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

function resolveMetadataBase(): URL {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    process.env.APP_URL ||
    `https://${siteConfig.domains.githubPages}`;

  try {
    return new URL(candidate);
  } catch {
    return new URL(`https://${siteConfig.domains.githubPages}`);
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: 'critical-dummy',
    template: '%s · critical-dummy',
  },
  description:
    'Personal developer website and GitHub activity explorer for critical-dummy.',
  openGraph: {
    title: 'critical-dummy',
    description:
      'Personal developer website and GitHub activity explorer for critical-dummy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'critical-dummy',
    description:
      'Personal developer website and GitHub activity explorer for critical-dummy.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(openSans.variable, ibmPlexMono.variable)}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-white font-sans text-[#111113] antialiased"
      >
        <MetroTransitionProvider>
          <SiteHeader />
          <main
            className={cn(
              'mx-auto w-full flex-1 overflow-x-clip px-4 py-8 sm:px-6 sm:py-10',
              siteConfig.layout.maxWidthClass
            )}
          >
            {children}
          </main>
          <SiteFooter />
        </MetroTransitionProvider>
      </body>
    </html>
  );
}
