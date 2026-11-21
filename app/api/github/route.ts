import { NextRequest, NextResponse } from 'next/server';
import {
  getGitHubProfile,
  getGitHubPublicEvents,
  getGitHubRepos,
} from '@/lib/github';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get('section') ?? 'all';
  const bypassCache = request.nextUrl.searchParams.get('fresh') === '1';
  const username = siteConfig.identity.githubUsername;

  if (section === 'repos') {
    const repos = await getGitHubRepos(username, { bypassCache });
    return NextResponse.json({ repos });
  }

  if (section === 'activity') {
    const [profile, repos, events] = await Promise.all([
      getGitHubProfile(username, { bypassCache }),
      getGitHubRepos(username, { bypassCache }),
      getGitHubPublicEvents(username, { bypassCache }),
    ]);
    return NextResponse.json({ profile, repos, events });
  }

  const [profile, repos, events] = await Promise.all([
    getGitHubProfile(username, { bypassCache }),
    getGitHubRepos(username, { bypassCache }),
    getGitHubPublicEvents(username, { bypassCache }),
  ]);

  return NextResponse.json({ profile, repos, events });
}
