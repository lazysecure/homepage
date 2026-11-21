'use client';

import { useMemo, useState } from 'react';
import { fetchClientGitHubRepos } from '@/lib/github-client';
import {
  extractLanguages,
  filterAndSortRepos,
  formatUtcDateTime,
} from '@/lib/github-logic';
import type {
  GitHubRepo,
  GitHubResult,
  RepoSortOption,
  RepoSourceFilter,
} from '@/lib/github-types';
import { DataStatusBanner } from './DataStatusBanner';
import { MetroIcon } from './MetroIcon';
import { MetroSelect, type MetroSelectOption } from './MetroSelect';
import { RepoRow } from './RepoRow';

const SORT_OPTIONS: readonly MetroSelectOption<RepoSortOption>[] = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'stars', label: 'Most starred' },
  { value: 'name', label: 'Name (A–Z)' },
];

interface ProjectsExplorerProps {
  initialResult: GitHubResult<GitHubRepo[]>;
}

export function ProjectsExplorer({ initialResult }: ProjectsExplorerProps) {
  const [result, setResult] = useState<GitHubResult<GitHubRepo[]>>(initialResult);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [source, setSource] = useState<RepoSourceFilter>('all');
  const [sort, setSort] = useState<RepoSortOption>('updated');

  const repos = useMemo(() => result.data ?? [], [result.data]);

  const languages = useMemo(() => extractLanguages(repos), [repos]);

  const filteredRepos = useMemo(
    () =>
      filterAndSortRepos(repos, {
        query,
        language,
        source,
        sort,
      }),
    [repos, query, language, source, sort]
  );

  const hasActiveFilters =
    query.trim().length > 0 || language !== 'all' || source !== 'all';

  const handleClearFilters = () => {
    setQuery('');
    setLanguage('all');
    setSource('all');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
        const directRepos = await fetchClientGitHubRepos();
        setResult(directRepos);
        return;
      }

      const response = await fetch('/api/github?section=repos&fresh=1', {
        cache: 'no-store',
      });
      if (response.status === 404 || response.status === 405) {
        const directRepos = await fetchClientGitHubRepos();
        setResult(directRepos);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = (await response.json()) as {
        repos: GitHubResult<GitHubRepo[]>;
      };
      if (payload.repos) {
        setResult(payload.repos);
      }
    } catch {
      setResult((prev) => ({
        status: 'error',
        data: prev.data,
        rateLimit: prev.rateLimit,
        errorMessage: 'Failed to refresh repository data from GitHub.',
        fetchedAt: new Date().toISOString(),
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Metro Command & Filter Strip (2px inputs, flat segmented toggles) */}
      <div className="space-y-4 bg-[#f2f2f3] p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="md:col-span-2 lg:col-span-5">
            <label
              htmlFor="repo-search-input"
              className="mb-1.5 block text-xs font-semibold text-[#18181b]"
            >
              Filter repositories
            </label>
            <div className="flex h-10 w-full items-center gap-2.5 border-2 border-[#a3a2a5] bg-white px-3 focus-within:border-[#18181b]">
              <MetroIcon
                name="search"
                className="shrink-0 text-[14px] text-[#52525b]"
              />
              <input
                id="repo-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, description, or language..."
                className="h-full w-full min-w-0 bg-transparent text-sm text-[#18181b] placeholder:text-[#71717a] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear repository search"
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-[#52525b] hover:text-[#18181b]"
                >
                  <MetroIcon name="cross" className="text-[11px]" />
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <label
              id="repo-sort-label"
              htmlFor="repo-sort-select"
              className="mb-1.5 block text-xs font-semibold text-[#18181b]"
            >
              Sort order
            </label>
            <MetroSelect
              id="repo-sort-select"
              labelId="repo-sort-label"
              value={sort}
              options={SORT_OPTIONS}
              onChange={setSort}
            />
          </div>

          <div className="lg:col-span-4 flex flex-wrap items-end justify-between gap-2 sm:flex-nowrap lg:justify-end">
            <div
              role="group"
              aria-label="Repository source filter"
              className="inline-flex h-10 bg-white"
            >
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'sources', label: 'Sources' },
                  { id: 'forks', label: 'Forks' },
                ] as const
              ).map((option) => {
                const active = source === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSource(option.id)}
                    aria-pressed={active}
                    className={`px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#18181b] text-white'
                        : 'text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh repositories from GitHub"
              className="inline-flex h-10 items-center gap-1.5 border-2 border-[#18181b] bg-white px-3.5 text-xs font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <MetroIcon
                name="loop2"
                className={`text-[13px] ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>{isRefreshing ? 'Syncing' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Language Pivot filter buttons */}
        {languages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 text-xs font-semibold text-[#52525b]">
              Language:
            </span>
            <button
              type="button"
              onClick={() => setLanguage('all')}
              aria-pressed={language === 'all'}
              className={`min-h-[34px] px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                language === 'all'
                  ? 'bg-[#18181b] text-white'
                  : 'bg-white text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]'
              }`}
            >
              All ({repos.length})
            </button>
            {languages.map((item) => {
              const active = language === item.language;
              return (
                <button
                  key={item.language}
                  type="button"
                  onClick={() => setLanguage(item.language)}
                  aria-pressed={active}
                  className={`min-h-[34px] px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#c2410c] text-white'
                      : 'bg-white text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]'
                  }`}
                >
                  {item.language} ({item.count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Status / Error banner */}
      <DataStatusBanner
        status={result.status}
        errorMessage={result.errorMessage}
        rateLimit={result.rateLimit}
        onRetry={handleRefresh}
        retrying={isRefreshing}
      />

      {/* Result metadata row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525b]">
        <p className="font-mono tabular-nums" data-testid="repo-count-summary">
          Showing {filteredRepos.length} of {repos.length} public repositories
        </p>
        <p className="font-mono tabular-nums">
          Synced {formatUtcDateTime(result.fetchedAt)}
        </p>
      </div>

      {/* Loading skeleton */}
      {isRefreshing ? (
        <div
          aria-busy="true"
          aria-label="Refreshing repositories"
          className="grid grid-cols-1 gap-2.5 md:grid-cols-2"
        >
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className="h-40 animate-pulse bg-[#f2f2f3] p-5" />
          ))}
        </div>
      ) : result.status !== 'ok' && repos.length === 0 ? (
        <div className="bg-[#f2f2f3] p-6 text-sm text-[#52525b]">
          Repository list could not be loaded from GitHub. Use the retry action
          above once network access or the GitHub API rate-limit window is
          available.
        </div>
      ) : repos.length === 0 ? (
        <div className="bg-[#f2f2f3] p-6 text-sm text-[#52525b]">
          This GitHub account currently has 0 public repositories.
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="flex flex-col items-start gap-3 bg-[#f2f2f3] p-6">
          <p className="text-sm font-semibold text-[#18181b]">
            No repositories match the current filters.
          </p>
          <p className="text-xs text-[#52525b]">
            Adjust the search query, language, or source filter to view public
            repositories.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex min-h-[40px] items-center border-2 border-[#18181b] bg-white px-4 py-1.5 text-xs font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          data-testid="repositories-grid"
          className="grid grid-cols-1 gap-2.5 md:grid-cols-2"
        >
          {filteredRepos.map((repo) => (
            <RepoRow key={repo.id} repo={repo} variant="light" />
          ))}
        </div>
      )}
    </div>
  );
}
