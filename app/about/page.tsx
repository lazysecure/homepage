import type { Metadata } from 'next';
import Link from 'next/link';
import { AvatarFrame } from '@/components/AvatarFrame';
import { DataStatusBanner } from '@/components/DataStatusBanner';
import { MetroIcon } from '@/components/MetroIcon';
import { MotionSection } from '@/components/MotionSection';
import { siteConfig } from '@/config/site';
import { getGitHubProfile } from '@/lib/github';
import { formatUtcDate } from '@/lib/github-logic';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Developer profile, technical interests, and development philosophy for critical-dummy.',
};

export const revalidate = 300;

export default async function AboutPage() {
  const profileResult = await getGitHubProfile(
    siteConfig.identity.githubUsername
  );
  const profile = profileResult.data;

  return (
    <MotionSection className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-[#18181b] sm:text-4xl">
          about
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[#52525b]">
          {siteConfig.about.lead}
        </p>
      </header>

      {profileResult.status !== 'ok' && (
        <DataStatusBanner
          status={profileResult.status}
          errorMessage={profileResult.errorMessage}
          rateLimit={profileResult.rateLimit}
        />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Borderless Charcoal Metro Profile Summary Tile */}
        <aside className="space-y-6 bg-[#18181b] p-6 text-white lg:col-span-4">
          <div className="flex items-center gap-3.5">
            <AvatarFrame
              src={profile?.avatarUrl}
              alt={`${siteConfig.identity.handle} avatar`}
              handle={siteConfig.identity.handle}
              size={56}
            />
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold text-white">
                {profile?.login ?? siteConfig.identity.githubUsername}
              </p>
              <p className="text-xs text-[#a3a2a5]">
                {profile?.name ?? siteConfig.identity.title}
              </p>
            </div>
          </div>

          <dl className="space-y-2.5 text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[#a3a2a5]">Public repos</dt>
              <dd className="font-mono font-semibold text-[#fb923c] tabular-nums">
                {profile ? profile.publicRepos : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[#a3a2a5]">Followers</dt>
              <dd className="font-mono text-white tabular-nums">
                {profile ? profile.followers : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[#a3a2a5]">Following</dt>
              <dd className="font-mono text-white tabular-nums">
                {profile ? profile.following : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[#a3a2a5]">Account created</dt>
              <dd className="font-mono text-white tabular-nums">
                {profile ? formatUtcDate(profile.createdAt) : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[#a3a2a5]">Location</dt>
              <dd className="font-mono text-white">
                {profileResult.status === 'ok'
                  ? (profile?.location ?? 'Not specified')
                  : 'Unavailable'}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2.5 pt-1">
            <a
              href={profile?.htmlUrl ?? siteConfig.identity.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="metro-tile inline-flex min-h-[40px] items-center justify-between bg-[#c2410c] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ea580c]"
            >
              <span>View GitHub Profile</span>
              <MetroIcon name="arrow-up-right" className="text-[12px]" />
            </a>
            <Link
              href="/projects"
              className="metro-tile inline-flex min-h-[40px] items-center justify-between border-2 border-white bg-transparent px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#18181b]"
            >
              <span>Inspect Repositories</span>
              <MetroIcon name="arrow-right" className="text-[12px]" />
            </Link>
          </div>
        </aside>

        {/* Borderless Whitespace-Driven Metro Prose Sections */}
        <div className="space-y-10 lg:col-span-8">
          {siteConfig.about.sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`about-${section.id}`}
              className="space-y-3"
            >
              <h2
                id={`about-${section.id}`}
                className="text-2xl font-light tracking-tight text-[#18181b]"
              >
                {section.heading.toLowerCase()}
              </h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="max-w-2xl text-[15px] leading-relaxed text-[#3f3f46]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
