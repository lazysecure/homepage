import Link from 'next/link';
import { AvatarFrame } from '@/components/AvatarFrame';
import { DataStatusBanner } from '@/components/DataStatusBanner';
import { MetroIcon } from '@/components/MetroIcon';
import { MotionSection } from '@/components/MotionSection';
import { RepoRow } from '@/components/RepoRow';
import { siteConfig } from '@/config/site';
import { getGitHubProfile, getGitHubRepos } from '@/lib/github';
import { formatUtcDate, selectFeaturedRepos } from '@/lib/github-logic';

export const revalidate = 300;

export default async function HomePage() {
  const [profileResult, reposResult] = await Promise.all([
    getGitHubProfile(siteConfig.identity.githubUsername),
    getGitHubRepos(siteConfig.identity.githubUsername),
  ]);

  const profile = profileResult.data;
  const allRepos = reposResult.data ?? [];
  const selectedRepos = selectFeaturedRepos(
    allRepos,
    siteConfig.selectedRepoNames,
    4
  );

  return (
    <MotionSection className="space-y-14">
      {/* Metro Hub Identity & Live Profile */}
      <section
        aria-labelledby="home-identity-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch"
      >
        <div className="flex flex-col justify-between gap-7 lg:col-span-8">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <AvatarFrame
                src={profile?.avatarUrl}
                alt={`${siteConfig.identity.handle} GitHub avatar`}
                handle={siteConfig.identity.handle}
                size={72}
              />
              <div className="min-w-0 space-y-1">
                <h1
                  id="home-identity-heading"
                  className="text-3xl font-light tracking-tight text-[#18181b] sm:text-4xl [text-wrap:balance]"
                >
                  {siteConfig.identity.title}
                </h1>
                <p className="text-sm font-semibold text-[#52525b]">
                  {siteConfig.identity.subtitle}
                </p>
                {profile && (
                  <p className="font-mono text-xs text-[#52525b] tabular-nums">
                    @{profile.login}
                    {profile.name && profile.name !== profile.login
                      ? ` · ${profile.name}`
                      : ''}
                    {' · '}
                    {profile.publicRepos} public repositories
                  </p>
                )}
              </div>
            </div>

            <p className="max-w-2xl text-[15px] leading-relaxed text-[#27272a]">
              {siteConfig.identity.introduction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/projects"
              className="metro-tile inline-flex min-h-[42px] items-center gap-2 bg-[#18181b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c2410c] whitespace-nowrap shrink-0"
            >
              <span>Browse Projects</span>
              <MetroIcon name="arrow-right" className="text-[14px]" />
            </Link>

            <a
              href={profile?.htmlUrl ?? siteConfig.identity.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="metro-tile inline-flex min-h-[42px] items-center gap-1.5 border-2 border-[#18181b] bg-white px-4 py-2 text-sm font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white whitespace-nowrap shrink-0"
            >
              <MetroIcon name="github" className="text-[14px]" />
              <span>GitHub Profile</span>
              <MetroIcon name="arrow-up-right" className="text-[12px]" />
            </a>

            {profile?.blog && (
              <a
                href={profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="metro-tile inline-flex min-h-[42px] items-center gap-1.5 border-2 border-[#18181b] bg-white px-4 py-2 text-sm font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white whitespace-nowrap shrink-0"
              >
                <span>Nekoweb</span>
                <MetroIcon name="arrow-up-right" className="text-[12px]" />
              </a>
            )}
          </div>
        </div>

        {/* Borderless Charcoal Metro Summary Tile */}
        <aside
          aria-label="Account index"
          className="flex flex-col justify-between gap-6 bg-[#18181b] p-5 text-white lg:col-span-4"
        >
          <dl className="space-y-2.5 text-xs">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#a3a2a5]">Handle</dt>
              <dd className="font-mono font-semibold text-white">
                {profile?.login ?? siteConfig.identity.githubUsername}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#a3a2a5]">GitHub bio</dt>
              <dd className="font-mono text-white">
                {profileResult.status === 'ok'
                  ? (profile?.bio ?? 'None set')
                  : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#a3a2a5]">Repositories</dt>
              <dd className="font-mono font-semibold text-[#fb923c] tabular-nums">
                {profileResult.status === 'ok' && profile
                  ? profile.publicRepos
                  : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#a3a2a5]">Joined</dt>
              <dd className="font-mono text-white tabular-nums">
                {profileResult.status === 'ok' && profile
                  ? formatUtcDate(profile.createdAt)
                  : 'Unavailable'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[#a3a2a5]">Pages host</dt>
              <dd className="font-mono text-white">
                {siteConfig.domains.githubPages}
              </dd>
            </div>
          </dl>

          <h2 className="text-sm font-semibold text-white">
            public github record
          </h2>
        </aside>
      </section>

      {/* Selected Projects: Borderless Metro Live Tile Grid */}
      <section aria-labelledby="selected-projects-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="selected-projects-heading"
            className="text-2xl font-light tracking-tight text-[#18181b] sm:text-3xl"
          >
            selected projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c2410c] transition-colors hover:text-[#18181b]"
          >
            <span>View all public repositories</span>
            <MetroIcon name="arrow-right" className="text-[12px]" />
          </Link>
        </div>

        {reposResult.status !== 'ok' && selectedRepos.length === 0 ? (
          <DataStatusBanner
            status={reposResult.status}
            errorMessage={reposResult.errorMessage}
            rateLimit={reposResult.rateLimit}
          />
        ) : selectedRepos.length === 0 ? (
          <div className="bg-[#f2f2f3] p-5 text-sm text-[#52525b]">
            No public repositories returned by GitHub for this account.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {selectedRepos.map((repo, index) => (
              <RepoRow
                key={repo.id}
                repo={repo}
                compact
                variant={index === 0 ? 'charcoal' : 'light'}
              />
            ))}
          </div>
        )}
      </section>

      {/* Current Interests: Borderless Typographic Columns */}
      <section aria-labelledby="interests-heading" className="space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="interests-heading"
            className="text-2xl font-light tracking-tight text-[#18181b] sm:text-3xl"
          >
            development fields
          </h2>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525b] transition-colors hover:text-[#c2410c]"
          >
            <span>Read full profile</span>
            <MetroIcon name="arrow-right" className="text-[12px]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {siteConfig.interests.map((field) => (
            <div
              key={field.title}
              className="flex flex-col justify-between gap-2.5"
            >
              <div className="space-y-1.5">
                <h3 className="text-[15px] font-semibold text-[#18181b]">
                  {field.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#52525b]">
                  {field.summary}
                </p>
              </div>
              {field.relatedRepos.length > 0 && (
                <p className="font-mono text-xs text-[#52525b]">
                  {field.relatedRepos.join(' · ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Workspace Navigation Tiles: Bottom-Left Labels */}
      <section aria-labelledby="workspace-links-heading" className="space-y-4">
        <h2
          id="workspace-links-heading"
          className="text-2xl font-light tracking-tight text-[#18181b] sm:text-3xl"
        >
          workspace
        </h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/projects"
            className="metro-tile flex min-h-[132px] flex-col justify-between bg-[#c2410c] p-5 text-white hover:bg-[#ea580c]"
          >
            <span className="text-xs leading-relaxed text-[#ffedd5]">
              Filter and sort all public repositories.
            </span>
            <span className="text-base font-semibold">Projects</span>
          </Link>

          <Link
            href="/activity"
            className="metro-tile flex min-h-[132px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b] hover:bg-[#e7e7ea]"
          >
            <span className="text-xs leading-relaxed text-[#52525b]">
              Recent public events and availability scope.
            </span>
            <span className="text-base font-semibold">GitHub Activity</span>
          </Link>

          <Link
            href="/about"
            className="metro-tile flex min-h-[132px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b] hover:bg-[#e7e7ea]"
          >
            <span className="text-xs leading-relaxed text-[#52525b]">
              Profile, technical interests, and philosophy.
            </span>
            <span className="text-base font-semibold">About</span>
          </Link>

          <Link
            href="/contact"
            className="metro-tile flex min-h-[132px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b] hover:bg-[#e7e7ea]"
          >
            <span className="text-xs leading-relaxed text-[#52525b]">
              GitHub profile and configurable links.
            </span>
            <span className="text-base font-semibold">Contact</span>
          </Link>
        </div>
      </section>
    </MotionSection>
  );
}
