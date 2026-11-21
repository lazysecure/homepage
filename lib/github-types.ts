export type FetchStatus = 'ok' | 'rate_limited' | 'not_found' | 'error';

export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  resetAt: string | null;
}

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  blog: string | null;
  location: string | null;
  company: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  fork: boolean;
  archived: boolean;
  topics: string[];
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
}

export interface GitHubPublicEvent {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  createdAt: string;
  summary: string;
  ref?: string | null;
  commitCount?: number | null;
}

export interface GitHubResult<T> {
  status: FetchStatus;
  data: T | null;
  rateLimit: RateLimitInfo;
  errorMessage: string | null;
  fetchedAt: string;
}

export type RepoSortOption = 'updated' | 'stars' | 'name';
export type RepoSourceFilter = 'all' | 'sources' | 'forks';

export interface RepoFilterOptions {
  query: string;
  language: string;
  source: RepoSourceFilter;
  sort: RepoSortOption;
}

export interface LanguageStat {
  language: string;
  count: number;
}

export interface ActivitySummary {
  totalRecentEvents: number;
  eventTypes: Array<{ type: string; label: string; count: number }>;
  activeRepos: Array<{ repoName: string; eventCount: number; latestAt: string }>;
  latestEventAt: string | null;
  availability: {
    publicEventsWindowDays: number;
    fullContributionGraphAvailable: boolean;
    privateActivityAvailable: boolean;
    reason: string;
  };
}
