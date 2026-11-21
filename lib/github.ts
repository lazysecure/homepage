import { siteConfig } from '@/config/site';
import { classifyGitHubError, parseRateLimitHeaders } from './github-logic';
import {
  mapGitHubProfile,
  mapGitHubPublicEvents,
  mapGitHubRepos,
} from './github-mappers';
import type {
  GitHubPublicEvent,
  GitHubRepo,
  GitHubResult,
  GitHubUserProfile,
  RateLimitInfo,
} from './github-types';

const GITHUB_API_BASE = 'https://api.github.com';
const REVALIDATE_SECONDS = 300;

function buildGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'critical-dummy-personal-website',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Strictly server-side token usage (never NEXT_PUBLIC_)
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

const emptyRateLimit: RateLimitInfo = {
  limit: null,
  remaining: null,
  resetAt: null,
};

async function fetchGitHubJson<T>(
  path: string,
  options?: { bypassCache?: boolean }
): Promise<GitHubResult<T>> {
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: buildGitHubHeaders(),
      ...(options?.bypassCache
        ? { cache: 'no-store' as const }
        : { next: { revalidate: REVALIDATE_SECONDS } }),
      signal: AbortSignal.timeout(8000),
    });

    const rateLimit = parseRateLimitHeaders(response.headers);

    if (!response.ok) {
      const classified = classifyGitHubError(response.status, rateLimit);
      return {
        status: classified.fetchStatus,
        data: null,
        rateLimit,
        errorMessage: classified.message,
        fetchedAt,
      };
    }

    const json = (await response.json()) as T;
    return {
      status: 'ok',
      data: json,
      rateLimit,
      errorMessage: null,
      fetchedAt,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'TimeoutError'
        ? 'GitHub API request timed out.'
        : 'Unable to reach the GitHub API right now.';

    return {
      status: 'error',
      data: null,
      rateLimit: emptyRateLimit,
      errorMessage: message,
      fetchedAt,
    };
  }
}

export async function getGitHubProfile(
  username = siteConfig.identity.githubUsername,
  options?: { bypassCache?: boolean }
): Promise<GitHubResult<GitHubUserProfile>> {
  const res = await fetchGitHubJson<Record<string, unknown>>(
    `/users/${encodeURIComponent(username)}`,
    options
  );

  if (res.status !== 'ok' || !res.data) {
    return {
      status: res.status,
      data: null,
      rateLimit: res.rateLimit,
      errorMessage: res.errorMessage,
      fetchedAt: res.fetchedAt,
    };
  }

  return {
    status: 'ok',
    data: mapGitHubProfile(res.data, username),
    rateLimit: res.rateLimit,
    errorMessage: null,
    fetchedAt: res.fetchedAt,
  };
}

export async function getGitHubRepos(
  username = siteConfig.identity.githubUsername,
  options?: { bypassCache?: boolean }
): Promise<GitHubResult<GitHubRepo[]>> {
  const res = await fetchGitHubJson<Array<Record<string, unknown>>>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    options
  );

  if (res.status !== 'ok' || !Array.isArray(res.data)) {
    return {
      status: res.status,
      data: null,
      rateLimit: res.rateLimit,
      errorMessage: res.errorMessage,
      fetchedAt: res.fetchedAt,
    };
  }

  return {
    status: 'ok',
    data: mapGitHubRepos(res.data),
    rateLimit: res.rateLimit,
    errorMessage: null,
    fetchedAt: res.fetchedAt,
  };
}

export async function getGitHubPublicEvents(
  username = siteConfig.identity.githubUsername,
  options?: { bypassCache?: boolean }
): Promise<GitHubResult<GitHubPublicEvent[]>> {
  const res = await fetchGitHubJson<Array<Record<string, unknown>>>(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`,
    options
  );

  if (res.status !== 'ok' || !Array.isArray(res.data)) {
    return {
      status: res.status,
      data: null,
      rateLimit: res.rateLimit,
      errorMessage: res.errorMessage,
      fetchedAt: res.fetchedAt,
    };
  }

  return {
    status: 'ok',
    data: mapGitHubPublicEvents(res.data),
    rateLimit: res.rateLimit,
    errorMessage: null,
    fetchedAt: res.fetchedAt,
  };
}
