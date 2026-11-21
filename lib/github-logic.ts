import type {
  ActivitySummary,
  FetchStatus,
  GitHubPublicEvent,
  GitHubRepo,
  LanguageStat,
  RateLimitInfo,
  RepoFilterOptions,
} from './github-types';

export const UNSPECIFIED_LANGUAGE = 'Unspecified';

export function filterAndSortRepos(
  repos: GitHubRepo[],
  options: RepoFilterOptions
): GitHubRepo[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  const filtered = repos.filter((repo) => {
    if (options.source === 'sources' && repo.fork) {
      return false;
    }
    if (options.source === 'forks' && !repo.fork) {
      return false;
    }

    if (options.language && options.language !== 'all') {
      const repoLang = repo.language ?? UNSPECIFIED_LANGUAGE;
      if (repoLang !== options.language) {
        return false;
      }
    }

    if (normalizedQuery.length > 0) {
      const haystack = [
        repo.name,
        repo.description ?? '',
        repo.language ?? '',
        ...repo.topics,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (options.sort === 'stars') {
      if (b.stargazersCount !== a.stargazersCount) {
        return b.stargazersCount - a.stargazersCount;
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    }

    if (options.sort === 'name') {
      return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    }

    // Default: most recently updated
    const dateA = a.pushedAt ?? a.updatedAt;
    const dateB = b.pushedAt ?? b.updatedAt;
    return dateB.localeCompare(dateA);
  });
}

export function extractLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    const label = repo.language ?? UNSPECIFIED_LANGUAGE;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => {
      if (a.language === UNSPECIFIED_LANGUAGE) return 1;
      if (b.language === UNSPECIFIED_LANGUAGE) return -1;
      if (b.count !== a.count) return b.count - a.count;
      return a.language.localeCompare(b.language);
    });
}

export function selectFeaturedRepos(
  repos: GitHubRepo[],
  selectedNames: string[],
  limit = 4
): GitHubRepo[] {
  if (repos.length === 0 || limit <= 0) {
    return [];
  }

  const byLowerName = new Map<string, GitHubRepo>();
  for (const repo of repos) {
    byLowerName.set(repo.name.toLowerCase(), repo);
  }

  const chosen: GitHubRepo[] = [];
  const seenIds = new Set<number>();

  for (const name of selectedNames) {
    const match = byLowerName.get(name.trim().toLowerCase());
    if (match && !seenIds.has(match.id)) {
      chosen.push(match);
      seenIds.add(match.id);
    }
    if (chosen.length >= limit) {
      return chosen;
    }
  }

  // Fill remaining slots with most recently updated non-fork repos, then any repo
  const remaining = [...repos]
    .filter((repo) => !seenIds.has(repo.id))
    .sort((a, b) => {
      if (a.fork !== b.fork) return a.fork ? 1 : -1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  for (const repo of remaining) {
    if (chosen.length >= limit) break;
    chosen.push(repo);
    seenIds.add(repo.id);
  }

  return chosen;
}

export function humanizeEventType(type: string): string {
  switch (type) {
    case 'PushEvent':
      return 'Push';
    case 'CreateEvent':
      return 'Create';
    case 'DeleteEvent':
      return 'Delete';
    case 'PullRequestEvent':
      return 'Pull Request';
    case 'IssuesEvent':
      return 'Issues';
    case 'IssueCommentEvent':
      return 'Issue Comment';
    case 'WatchEvent':
      return 'Star';
    case 'ForkEvent':
      return 'Fork';
    case 'ReleaseEvent':
      return 'Release';
    case 'PublicEvent':
      return 'Public';
    default:
      return type.replace(/Event$/, '') || 'Event';
  }
}

export function summarizePublicEventPayload(
  type: string,
  payload: Record<string, unknown> | undefined
): { summary: string; ref: string | null; commitCount: number | null } {
  const safePayload = payload ?? {};
  const rawRef = typeof safePayload.ref === 'string' ? safePayload.ref : null;
  const cleanRef = rawRef ? rawRef.replace(/^refs\/heads\//, '') : null;

  if (type === 'PushEvent') {
    const commits = Array.isArray(safePayload.commits) ? safePayload.commits : null;
    const size =
      typeof safePayload.size === 'number'
        ? safePayload.size
        : commits
          ? commits.length
          : null;
    const branchLabel = cleanRef ? ` to ${cleanRef}` : '';
    if (size !== null && size > 0) {
      return {
        summary: `Pushed ${size} commit${size === 1 ? '' : 's'}${branchLabel}`,
        ref: cleanRef,
        commitCount: size,
      };
    }
    return {
      summary: `Pushed changes${branchLabel}`,
      ref: cleanRef,
      commitCount: null,
    };
  }

  if (type === 'CreateEvent') {
    const refType =
      typeof safePayload.ref_type === 'string' ? safePayload.ref_type : 'resource';
    return {
      summary: cleanRef
        ? `Created ${refType} ${cleanRef}`
        : `Created ${refType}`,
      ref: cleanRef,
      commitCount: null,
    };
  }

  if (type === 'DeleteEvent') {
    const refType =
      typeof safePayload.ref_type === 'string' ? safePayload.ref_type : 'ref';
    return {
      summary: cleanRef ? `Deleted ${refType} ${cleanRef}` : `Deleted ${refType}`,
      ref: cleanRef,
      commitCount: null,
    };
  }

  if (type === 'PullRequestEvent') {
    const action =
      typeof safePayload.action === 'string' ? safePayload.action : 'updated';
    return {
      summary: `Pull request ${action}`,
      ref: cleanRef,
      commitCount: null,
    };
  }

  if (type === 'IssuesEvent') {
    const action =
      typeof safePayload.action === 'string' ? safePayload.action : 'updated';
    return {
      summary: `Issue ${action}`,
      ref: cleanRef,
      commitCount: null,
    };
  }

  if (type === 'WatchEvent') {
    return {
      summary: 'Starred repository',
      ref: null,
      commitCount: null,
    };
  }

  if (type === 'ForkEvent') {
    return {
      summary: 'Forked repository',
      ref: null,
      commitCount: null,
    };
  }

  return {
    summary: humanizeEventType(type),
    ref: cleanRef,
    commitCount: null,
  };
}

export function summarizeActivity(
  events: GitHubPublicEvent[],
  eventsAvailable: boolean
): ActivitySummary {
  const typeCounts = new Map<string, number>();
  const repoStats = new Map<string, { eventCount: number; latestAt: string }>();

  for (const event of events) {
    typeCounts.set(event.type, (typeCounts.get(event.type) ?? 0) + 1);
    const existing = repoStats.get(event.repoName);
    if (!existing) {
      repoStats.set(event.repoName, {
        eventCount: 1,
        latestAt: event.createdAt,
      });
    } else {
      existing.eventCount += 1;
      if (event.createdAt > existing.latestAt) {
        existing.latestAt = event.createdAt;
      }
    }
  }

  const eventTypes = Array.from(typeCounts.entries())
    .map(([type, count]) => ({
      type,
      label: humanizeEventType(type),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const activeRepos = Array.from(repoStats.entries())
    .map(([repoName, stat]) => ({
      repoName,
      eventCount: stat.eventCount,
      latestAt: stat.latestAt,
    }))
    .sort(
      (a, b) =>
        b.eventCount - a.eventCount || b.latestAt.localeCompare(a.latestAt)
    );

  return {
    totalRecentEvents: events.length,
    eventTypes,
    activeRepos,
    latestEventAt: events[0]?.createdAt ?? null,
    availability: {
      publicEventsWindowDays: 90,
      fullContributionGraphAvailable: false,
      privateActivityAvailable: false,
      reason: eventsAvailable
        ? 'GitHub’s public REST Events API returns up to 100 public events from the last 90 days. Full 365-day contribution heatmaps and private repository activity require authenticated GraphQL access and are intentionally marked unavailable rather than approximated.'
        : 'Public event data could not be retrieved from the GitHub API right now. Unavailable data is distinct from zero activity.',
    },
  };
}

export function parseRateLimitHeaders(headers: Headers): RateLimitInfo {
  const limitRaw = headers.get('x-ratelimit-limit');
  const remainingRaw = headers.get('x-ratelimit-remaining');
  const resetRaw = headers.get('x-ratelimit-reset');

  const limit = limitRaw !== null && limitRaw !== '' ? Number(limitRaw) : null;
  const remaining =
    remainingRaw !== null && remainingRaw !== '' ? Number(remainingRaw) : null;

  let resetAt: string | null = null;
  if (resetRaw !== null && resetRaw !== '') {
    const epochSeconds = Number(resetRaw);
    if (Number.isFinite(epochSeconds) && epochSeconds > 0) {
      resetAt = new Date(epochSeconds * 1000).toISOString();
    }
  }

  return {
    limit: limit !== null && Number.isFinite(limit) ? limit : null,
    remaining:
      remaining !== null && Number.isFinite(remaining) ? remaining : null,
    resetAt,
  };
}

export function classifyGitHubError(
  status: number,
  rateLimit: RateLimitInfo
): { fetchStatus: FetchStatus; message: string } {
  if (status === 404) {
    return {
      fetchStatus: 'not_found',
      message: 'GitHub resource was not found for this account.',
    };
  }

  if (status === 403 || status === 429) {
    if (rateLimit.remaining === 0 || status === 429) {
      const resetNote = rateLimit.resetAt
        ? ` Rate limit resets at ${formatUtcDateTime(rateLimit.resetAt)}.`
        : '';
      return {
        fetchStatus: 'rate_limited',
        message: `GitHub API rate limit reached.${resetNote}`,
      };
    }
    return {
      fetchStatus: 'rate_limited',
      message: 'GitHub API access temporarily restricted (HTTP 403).',
    };
  }

  return {
    fetchStatus: 'error',
    message: `GitHub API returned HTTP ${status}.`,
  };
}

export function formatUtcDate(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Unavailable';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return 'Unavailable';
  return parsed.toISOString().slice(0, 10);
}

export function formatUtcDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return 'Unavailable';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return 'Unavailable';
  return `${parsed.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}
