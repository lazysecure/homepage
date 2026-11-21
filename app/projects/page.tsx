import type { Metadata } from 'next';
import { MotionSection } from '@/components/MotionSection';
import { ProjectsExplorer } from '@/components/ProjectsExplorer';
import { siteConfig } from '@/config/site';
import { getGitHubRepos } from '@/lib/github';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Public GitHub repositories for critical-dummy with live filtering and sorting.',
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const reposResult = await getGitHubRepos(siteConfig.identity.githubUsername);

  return (
    <MotionSection className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-[#18181b] sm:text-4xl">
          projects
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[#52525b]">
          Public repositories retrieved directly from GitHub for{' '}
          <span className="font-mono font-semibold text-[#18181b]">
            {siteConfig.identity.githubUsername}
          </span>
          . Descriptions, languages, and timestamps reflect live repository
          metadata.
        </p>
      </header>

      <ProjectsExplorer initialResult={reposResult} />
    </MotionSection>
  );
}
