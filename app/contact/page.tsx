import type { Metadata } from 'next';
import { ContactLinks } from '@/components/ContactLinks';
import { MotionSection } from '@/components/MotionSection';
import { siteConfig } from '@/config/site';
import { getGitHubProfile } from '@/lib/github';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'GitHub profile and configurable contact channels for critical-dummy.',
};

export const revalidate = 300;

export default async function ContactPage() {
  const profileResult = await getGitHubProfile(
    siteConfig.identity.githubUsername
  );
  const profile = profileResult.data;

  const configuredHrefs = new Set(
    siteConfig.contact.channels.map((c) => c.href?.replace(/\/+$/, ''))
  );
  const channels = [...siteConfig.contact.channels];

  if (
    profile?.blog &&
    !configuredHrefs.has(profile.blog.replace(/\/+$/, ''))
  ) {
    channels.push({
      id: 'github-profile-blog',
      label: 'Website (from GitHub profile)',
      value: profile.blog.replace(/^https?:\/\//, ''),
      href: profile.blog.startsWith('http')
        ? profile.blog
        : `https://${profile.blog}`,
      note: 'Discovered dynamically from public GitHub user metadata.',
      copyable: true,
      external: true,
    });
  }

  return (
    <MotionSection className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-[#18181b] sm:text-4xl">
          contact
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[#52525b]">
          {siteConfig.contact.lead}
        </p>
      </header>

      <div className="space-y-4">
        <ContactLinks channels={channels} />

        <p className="text-xs text-[#52525b]">
          {siteConfig.contact.availabilityNote}
        </p>
      </div>
    </MotionSection>
  );
}
