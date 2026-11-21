import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyGitHubError,
  extractLanguages,
  filterAndSortRepos,
  formatUtcDate,
  formatUtcDateTime,
  parseRateLimitHeaders,
  selectFeaturedRepos,
  summarizeActivity,
  summarizePublicEventPayload,
  UNSPECIFIED_LANGUAGE,
} from './github-logic';
import type { GitHubPublicEvent, GitHubRepo } from './github-types';

const sampleRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'Project-CHOKEPOINT',
    fullName: 'critical-dummy/Project-CHOKEPOINT',
    description: 'Browser-based modern warfare FPS simulation.',
    htmlUrl: 'https://github.com/critical-dummy/Project-CHOKEPOINT',
    homepage: null,
    language: 'TypeScript',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    fork: false,
    archived: false,
    topics: ['simulation', 'fps'],
    defaultBranch: 'main',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-11-14T10:58:01Z',
    pushedAt: '2026-11-14T10:58:01Z',
  },
  {
    id: 2,
    name: 'macandcheese',
    fullName: 'critical-dummy/macandcheese',
    description: 'macOS Framework for Windows. (Inspired by Wine)',
    htmlUrl: 'https://github.com/critical-dummy/macandcheese',
    homepage: null,
    language: 'C++',
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    fork: false,
    archived: false,
    topics: [],
    defaultBranch: 'main',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-10-20T10:39:12Z',
    pushedAt: '2026-10-20T10:39:12Z',
  },
  {
    id: 3,
    name: 'text.presence',
    fullName: 'critical-dummy/text.presence',
    description: 'rich presence client in terminal',
    htmlUrl: 'https://github.com/critical-dummy/text.presence',
    homepage: null,
    language: 'C++',
    stargazersCount: 1,
    forksCount: 0,
    openIssuesCount: 0,
    fork: false,
    archived: false,
    topics: [],
    defaultBranch: 'main',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-09-28T13:46:23Z',
    pushedAt: '2026-09-28T13:46:23Z',
  },
  {
    id: 4,
    name: 'DetailSU',
    fullName: 'critical-dummy/DetailSU',
    description: 'A Kernel based root solution for Android',
    htmlUrl: 'https://github.com/critical-dummy/DetailSU',
    homepage: 'https://kernelsu.org',
    language: null,
    stargazersCount: 0,
    forksCount: 0,
    openIssuesCount: 0,
    fork: true,
    archived: false,
    topics: [],
    defaultBranch: 'main',
    createdAt: '2026-09-10T00:00:00Z',
    updatedAt: '2026-10-21T13:35:55Z',
    pushedAt: '2026-10-21T13:35:55Z',
  },
];

test('filterAndSortRepos filters by search query across name and description', () => {
  const results = filterAndSortRepos(sampleRepos, {
    query: 'wine',
    language: 'all',
    source: 'all',
    sort: 'updated',
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'macandcheese');
});

test('filterAndSortRepos filters by language including Unspecified', () => {
  const cpp = filterAndSortRepos(sampleRepos, {
    query: '',
    language: 'C++',
    source: 'all',
    sort: 'updated',
  });
  assert.deepEqual(
    cpp.map((r) => r.name),
    ['macandcheese', 'text.presence']
  );

  const unspecified = filterAndSortRepos(sampleRepos, {
    query: '',
    language: UNSPECIFIED_LANGUAGE,
    source: 'all',
    sort: 'updated',
  });
  assert.deepEqual(
    unspecified.map((r) => r.name),
    ['DetailSU']
  );
});

test('filterAndSortRepos filters by source type and sorts by stars and name', () => {
  const forksOnly = filterAndSortRepos(sampleRepos, {
    query: '',
    language: 'all',
    source: 'forks',
    sort: 'updated',
  });
  assert.deepEqual(
    forksOnly.map((r) => r.name),
    ['DetailSU']
  );

  const byStars = filterAndSortRepos(sampleRepos, {
    query: '',
    language: 'all',
    source: 'sources',
    sort: 'stars',
  });
  assert.equal(byStars[0].name, 'text.presence');

  const byName = filterAndSortRepos(sampleRepos, {
    query: '',
    language: 'all',
    source: 'all',
    sort: 'name',
  });
  assert.deepEqual(
    byName.map((r) => r.name),
    ['DetailSU', 'macandcheese', 'Project-CHOKEPOINT', 'text.presence']
  );
});

test('extractLanguages counts languages and places Unspecified last', () => {
  const langs = extractLanguages(sampleRepos);
  assert.deepEqual(langs, [
    { language: 'C++', count: 2 },
    { language: 'TypeScript', count: 1 },
    { language: 'Unspecified', count: 1 },
  ]);
});

test('selectFeaturedRepos preserves configured priority and fills from non-fork repos', () => {
  const selected = selectFeaturedRepos(
    sampleRepos,
    ['text.presence', 'missing-repo', 'Project-CHOKEPOINT'],
    3
  );
  assert.deepEqual(
    selected.map((r) => r.name),
    ['text.presence', 'Project-CHOKEPOINT', 'macandcheese']
  );
});

test('summarizePublicEventPayload handles PushEvent with and without commits', () => {
  const withSize = summarizePublicEventPayload('PushEvent', {
    ref: 'refs/heads/main',
    size: 3,
  });
  assert.equal(withSize.summary, 'Pushed 3 commits to main');
  assert.equal(withSize.ref, 'main');
  assert.equal(withSize.commitCount, 3);

  const withoutCommits = summarizePublicEventPayload('PushEvent', {
    ref: 'refs/heads/dev',
  });
  assert.equal(withoutCommits.summary, 'Pushed changes to dev');
  assert.equal(withoutCommits.commitCount, null);
});

test('summarizeActivity aggregates events and marks unavailable GraphQL metrics honestly', () => {
  const events: GitHubPublicEvent[] = [
    {
      id: '10',
      type: 'PushEvent',
      repoName: 'critical-dummy/Project-CHOKEPOINT',
      repoUrl: 'https://github.com/critical-dummy/Project-CHOKEPOINT',
      createdAt: '2026-11-14T11:50:22Z',
      summary: 'Pushed changes to main',
    },
    {
      id: '11',
      type: 'PushEvent',
      repoName: 'critical-dummy/Project-CHOKEPOINT',
      repoUrl: 'https://github.com/critical-dummy/Project-CHOKEPOINT',
      createdAt: '2026-11-14T11:49:43Z',
      summary: 'Pushed changes to main',
    },
  ];

  const availableSummary = summarizeActivity(events, true);
  assert.equal(availableSummary.totalRecentEvents, 2);
  assert.equal(availableSummary.eventTypes[0].label, 'Push');
  assert.equal(availableSummary.activeRepos[0].eventCount, 2);
  assert.equal(
    availableSummary.availability.fullContributionGraphAvailable,
    false
  );

  const unavailableSummary = summarizeActivity([], false);
  assert.equal(unavailableSummary.totalRecentEvents, 0);
  assert.match(unavailableSummary.availability.reason, /Unavailable data is distinct/);
});

test('parseRateLimitHeaders and classifyGitHubError distinguish rate limit from 404 and 500', () => {
  const headers = new Headers({
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '0',
    'x-ratelimit-reset': '1795171200',
  });
  const rl = parseRateLimitHeaders(headers);
  assert.equal(rl.limit, 60);
  assert.equal(rl.remaining, 0);
  assert.ok(rl.resetAt);

  const rateErr = classifyGitHubError(403, rl);
  assert.equal(rateErr.fetchStatus, 'rate_limited');
  assert.match(rateErr.message, /rate limit/i);

  const notFound = classifyGitHubError(404, {
    limit: 60,
    remaining: 55,
    resetAt: null,
  });
  assert.equal(notFound.fetchStatus, 'not_found');

  const serverErr = classifyGitHubError(502, {
    limit: null,
    remaining: null,
    resetAt: null,
  });
  assert.equal(serverErr.fetchStatus, 'error');
});

test('date formatting helpers return deterministic UTC strings and handle missing inputs', () => {
  assert.equal(formatUtcDate('2026-11-14T10:58:01Z'), '2026-11-14');
  assert.equal(formatUtcDate(null), 'Unavailable');
  assert.equal(formatUtcDateTime('2026-11-14T10:58:01Z'), '2026-11-14 10:58 UTC');
  assert.equal(formatUtcDateTime('not-a-date'), 'Unavailable');
});
