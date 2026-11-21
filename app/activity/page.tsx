import type { Metadata } from 'next';
import { ActivityView } from '@/components/ActivityView';
import { MotionSection } from '@/components/MotionSection';
import { siteConfig } from '@/config/site';
import {
  getGitHubProfile,
  getGitHubPublicEvents,
  getGitHubRepos,
} from '@/lib/github';

export const metadata: Metadata = {
  title: 'GitHub Activity',
  description:
    'Live public GitHub activity, repository summary, and data availability boundaries for critical-dummy.',
};

export const revalidate = 300;

export default async function ActivityPage() {
  const username = siteConfig.identity.githubUsername;
  const [profileResult, reposResult, eventsResult] = await Promise.all([
    getGitHubProfile(username),
    getGitHubRepos(username),
    getGitHubPublicEvents(username),
  ]);

  return (
    <MotionSection className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-[#18181b] sm:text-4xl">
          github activity
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[#52525b]">
          Live public repository and event information from GitHub for{' '}
          <span className="font-mono font-semibold text-[#18181b]">
            {username}
          </span>
          . Unavailable metrics are explicitly labeled so missing data is never
          mistaken for zero activity.
        </p>
      </header>

      <ActivityView
        initialProfile={profileResult}
        initialRepos={reposResult}
        initialEvents={eventsResult}
      />
    </MotionSection>
  );
}
