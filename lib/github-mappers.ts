import { summarizePublicEventPayload } from './github-logic';
import type {
  GitHubPublicEvent,
  GitHubRepo,
  GitHubUserProfile,
} from './github-types';

export function mapGitHubProfile(
  raw: Record<string, unknown>,
  fallbackUsername: string
): GitHubUserProfile {
  return {
    login: String(raw.login ?? fallbackUsername),
    name: typeof raw.name === 'string' ? raw.name : null,
    avatarUrl:
      typeof raw.avatar_url === 'string'
        ? raw.avatar_url
        : `https://avatars.githubusercontent.com/${encodeURIComponent(fallbackUsername)}`,
    htmlUrl:
      typeof raw.html_url === 'string'
        ? raw.html_url
        : `https://github.com/${encodeURIComponent(fallbackUsername)}`,
    bio: typeof raw.bio === 'string' && raw.bio.trim() ? raw.bio : null,
    blog: typeof raw.blog === 'string' && raw.blog.trim() ? raw.blog : null,
    location:
      typeof raw.location === 'string' && raw.location.trim()
        ? raw.location
        : null,
    company:
      typeof raw.company === 'string' && raw.company.trim()
        ? raw.company
        : null,
    publicRepos: typeof raw.public_repos === 'number' ? raw.public_repos : 0,
    publicGists: typeof raw.public_gists === 'number' ? raw.public_gists : 0,
    followers: typeof raw.followers === 'number' ? raw.followers : 0,
    following: typeof raw.following === 'number' ? raw.following : 0,
    createdAt: typeof raw.created_at === 'string' ? raw.created_at : '',
    updatedAt: typeof raw.updated_at === 'string' ? raw.updated_at : '',
  };
}

export function mapGitHubRepos(
  rawList: Array<Record<string, unknown>>
): GitHubRepo[] {
  return rawList.map((raw) => ({
    id: typeof raw.id === 'number' ? raw.id : 0,
    name: typeof raw.name === 'string' ? raw.name : 'unnamed-repository',
    fullName: typeof raw.full_name === 'string' ? raw.full_name : '',
    description:
      typeof raw.description === 'string' && raw.description.trim()
        ? raw.description
        : null,
    htmlUrl: typeof raw.html_url === 'string' ? raw.html_url : '',
    homepage:
      typeof raw.homepage === 'string' && raw.homepage.trim()
        ? raw.homepage
        : null,
    language:
      typeof raw.language === 'string' && raw.language.trim()
        ? raw.language
        : null,
    stargazersCount:
      typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
    forksCount: typeof raw.forks_count === 'number' ? raw.forks_count : 0,
    openIssuesCount:
      typeof raw.open_issues_count === 'number' ? raw.open_issues_count : 0,
    fork: Boolean(raw.fork),
    archived: Boolean(raw.archived),
    topics: Array.isArray(raw.topics)
      ? raw.topics.filter((t): t is string => typeof t === 'string')
      : [],
    defaultBranch:
      typeof raw.default_branch === 'string' ? raw.default_branch : 'main',
    createdAt: typeof raw.created_at === 'string' ? raw.created_at : '',
    updatedAt: typeof raw.updated_at === 'string' ? raw.updated_at : '',
    pushedAt: typeof raw.pushed_at === 'string' ? raw.pushed_at : null,
  }));
}

export function mapGitHubPublicEvents(
  rawList: Array<Record<string, unknown>>
): GitHubPublicEvent[] {
  return rawList.map((raw, index) => {
    const type = typeof raw.type === 'string' ? raw.type : 'Event';
    const repoObj =
      raw.repo && typeof raw.repo === 'object'
        ? (raw.repo as Record<string, unknown>)
        : {};
    const repoName =
      typeof repoObj.name === 'string' ? repoObj.name : 'unknown/repository';
    const payload =
      raw.payload && typeof raw.payload === 'object'
        ? (raw.payload as Record<string, unknown>)
        : undefined;
    const parsed = summarizePublicEventPayload(type, payload);

    return {
      id: typeof raw.id === 'string' ? raw.id : `event-${index}`,
      type,
      repoName,
      repoUrl: `https://github.com/${repoName}`,
      createdAt: typeof raw.created_at === 'string' ? raw.created_at : '',
      summary: parsed.summary,
      ref: parsed.ref,
      commitCount: parsed.commitCount,
    };
  });
}
