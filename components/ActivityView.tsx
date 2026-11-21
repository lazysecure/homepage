'use client';

import { useMemo, useState } from 'react';
import {
  fetchClientGitHubProfile,
  fetchClientGitHubPublicEvents,
  fetchClientGitHubRepos,
} from '@/lib/github-client';
import {
  extractLanguages,
  formatUtcDate,
  formatUtcDateTime,
  humanizeEventType,
  summarizeActivity,
} from '@/lib/github-logic';
import type {
  GitHubPublicEvent,
  GitHubRepo,
  GitHubResult,
  GitHubUserProfile,
} from '@/lib/github-types';
import { DataStatusBanner } from './DataStatusBanner';
import { MetroIcon } from './MetroIcon';

interface ActivityViewProps {
  initialProfile: GitHubResult<GitHubUserProfile>;
  initialRepos: GitHubResult<GitHubRepo[]>;
  initialEvents: GitHubResult<GitHubPublicEvent[]>;
}

export function ActivityView({
  initialProfile,
  initialRepos,
  initialEvents,
}: ActivityViewProps) {
  const [profileResult, setProfileResult] = useState(initialProfile);
  const [reposResult, setReposResult] = useState(initialRepos);
  const [eventsResult, setEventsResult] = useState(initialEvents);
  const [eventFilter, setEventFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const profile = profileResult.data;
  const repos = useMemo(() => reposResult.data ?? [], [reposResult.data]);
  const events = useMemo(() => eventsResult.data ?? [], [eventsResult.data]);

  const eventsAvailable = eventsResult.status === 'ok';
  const summary = useMemo(
    () => summarizeActivity(events, eventsAvailable),
    [events, eventsAvailable]
  );

  const languageStats = useMemo(() => extractLanguages(repos), [repos]);

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter((event) => event.type === eventFilter);
  }, [events, eventFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const refreshDirect = async () => {
      const [profile, reposData, eventsData] = await Promise.all([
        fetchClientGitHubProfile(),
        fetchClientGitHubRepos(),
        fetchClientGitHubPublicEvents(),
      ]);
      setProfileResult(profile);
      setReposResult(reposData);
      setEventsResult(eventsData);
    };

    try {
      if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
        await refreshDirect();
        return;
      }

      const response = await fetch('/api/github?section=activity&fresh=1', {
        cache: 'no-store',
      });
      if (response.status === 404 || response.status === 405) {
        await refreshDirect();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = (await response.json()) as {
        profile: GitHubResult<GitHubUserProfile>;
        repos: GitHubResult<GitHubRepo[]>;
        events: GitHubResult<GitHubPublicEvent[]>;
      };
      if (payload.profile) setProfileResult(payload.profile);
      if (payload.repos) setReposResult(payload.repos);
      if (payload.events) setEventsResult(payload.events);
    } catch {
      const now = new Date().toISOString();
      setEventsResult((prev) => ({
        status: 'error',
        data: prev.data,
        rateLimit: prev.rateLimit,
        errorMessage: 'Failed to refresh public GitHub activity.',
        fetchedAt: now,
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  const primaryErrorResult =
    eventsResult.status !== 'ok'
      ? eventsResult
      : reposResult.status !== 'ok'
        ? reposResult
        : profileResult.status !== 'ok'
          ? profileResult
          : null;

  return (
    <div className="space-y-10">
      {/* Metro Command Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f2f2f3] px-4 py-3">
        <div className="font-mono text-xs text-[#52525b] tabular-nums">
          Last checked: {formatUtcDateTime(eventsResult.fetchedAt)}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex min-h-[38px] items-center gap-2 border-2 border-[#18181b] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <MetroIcon
            name="loop2"
            className={`text-[13px] ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span>{isRefreshing ? 'Syncing activity...' : 'Refresh activity'}</span>
        </button>
      </div>

      {primaryErrorResult && (
        <DataStatusBanner
          status={primaryErrorResult.status}
          errorMessage={primaryErrorResult.errorMessage}
          rateLimit={primaryErrorResult.rateLimit}
          onRetry={handleRefresh}
          retrying={isRefreshing}
        />
      )}

      {/* Official Metro Live KPI Tiles (large light value top-left, label bottom-left) */}
      <section
        aria-labelledby="activity-overview-heading"
        className="space-y-4"
      >
        <h2
          id="activity-overview-heading"
          className="text-2xl font-light tracking-tight text-[#18181b]"
        >
          public github snapshot
        </h2>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-h-[144px] flex-col justify-between bg-[#18181b] p-5 text-white">
            <p className="font-mono text-4xl font-light text-white tabular-nums">
              {profileResult.status === 'ok' && profile ? (
                profile.publicRepos
              ) : reposResult.status === 'ok' ? (
                repos.length
              ) : (
                <span className="text-2xl text-[#a3a2a5]">Unavailable</span>
              )}
            </p>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">
                Public repositories
              </p>
              <p className="text-xs text-[#a3a2a5]">
                {profileResult.status === 'ok'
                  ? 'Live from /users profile'
                  : 'Profile endpoint unavailable'}
              </p>
            </div>
          </div>

          <div className="flex min-h-[144px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b]">
            <p className="font-mono text-4xl font-light text-[#c2410c] tabular-nums">
              {eventsAvailable ? (
                summary.totalRecentEvents
              ) : (
                <span className="text-2xl text-[#52525b]">Unavailable</span>
              )}
            </p>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#18181b]">
                Recent public events (90d)
              </p>
              <p className="text-xs text-[#52525b]">
                {eventsAvailable
                  ? summary.totalRecentEvents === 0
                    ? 'Zero events in 90-day window'
                    : `Latest ${formatUtcDate(summary.latestEventAt)}`
                  : 'Events endpoint unavailable'}
              </p>
            </div>
          </div>

          <div className="flex min-h-[144px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b]">
            <p className="font-mono text-2xl font-light text-[#52525b]">
              Unavailable
            </p>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#18181b]">
                365-day contribution total
              </p>
              <p className="text-xs text-[#52525b]">
                Requires authenticated GraphQL API
              </p>
            </div>
          </div>

          <div className="flex min-h-[144px] flex-col justify-between bg-[#f2f2f3] p-5 text-[#18181b]">
            <p className="font-mono text-2xl font-light text-[#18181b] tabular-nums">
              {profileResult.status === 'ok' && profile ? (
                formatUtcDate(profile.createdAt)
              ) : (
                <span className="text-[#52525b]">Unavailable</span>
              )}
            </p>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[#18181b]">
                Account created
              </p>
              <p className="text-xs text-[#52525b]">
                {profileResult.status === 'ok' && profile
                  ? `${profile.followers} follower${profile.followers === 1 ? '' : 's'} · ${profile.following} following`
                  : 'Profile metadata unavailable'}
              </p>
            </div>
          </div>
        </div>

        {/* Borderless Metro Data Availability Notice */}
        <div className="flex items-start gap-3 bg-[#f2f2f3] p-4">
          <MetroIcon
            name="info"
            className="mt-0.5 shrink-0 text-[15px] text-[#ea580c]"
          />
          <div className="space-y-1 text-xs leading-relaxed text-[#52525b]">
            <p className="font-semibold text-[#18181b]">
              Data availability boundary
            </p>
            <p>{summary.availability.reason}</p>
          </div>
        </div>
      </section>

      {/* Repository breakdown: borderless Metro blocks */}
      <section
        aria-labelledby="repo-breakdown-heading"
        className="grid grid-cols-1 gap-2.5 lg:grid-cols-2"
      >
        <div className="space-y-4 bg-[#f2f2f3] p-5">
          <h2
            id="repo-breakdown-heading"
            className="text-lg font-light tracking-tight text-[#18181b]"
          >
            public repository languages
          </h2>
          {reposResult.status !== 'ok' && repos.length === 0 ? (
            <p className="text-xs text-[#52525b]">
              Language breakdown is unavailable while repository data cannot be
              fetched.
            </p>
          ) : languageStats.length === 0 ? (
            <p className="text-xs text-[#52525b]">
              Zero public repositories available to summarize.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {languageStats.map((stat) => (
                <li
                  key={stat.language}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#18181b]">
                    {stat.language}
                  </span>
                  <span className="font-mono text-[#52525b] tabular-nums">
                    {stat.count} {stat.count === 1 ? 'repo' : 'repos'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 bg-[#f2f2f3] p-5">
          <h2 className="text-lg font-light tracking-tight text-[#18181b]">
            repositories in recent public events
          </h2>
          {!eventsAvailable ? (
            <p className="text-xs text-[#52525b]">
              Recent repository activity cannot be computed because the public
              events endpoint is unavailable.
            </p>
          ) : summary.activeRepos.length === 0 ? (
            <p className="text-xs text-[#52525b]">
              Zero public events recorded across repositories in the last 90
              days.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {summary.activeRepos.slice(0, 8).map((item) => (
                <li
                  key={item.repoName}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <a
                    href={`https://github.com/${item.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono font-semibold text-[#18181b] hover:text-[#c2410c]"
                  >
                    <span>{item.repoName}</span>
                    <MetroIcon name="arrow-up-right" className="text-[11px]" />
                  </a>
                  <span className="font-mono text-[#52525b] tabular-nums">
                    {item.eventCount} event{item.eventCount === 1 ? '' : 's'} ·{' '}
                    {formatUtcDate(item.latestAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Public Events Timeline: Official Metro Unboxed ListView */}
      <section aria-labelledby="events-log-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="events-log-heading"
            className="text-2xl font-light tracking-tight text-[#18181b]"
          >
            public event log
          </h2>

          {summary.eventTypes.length > 0 && (
            <div
              role="group"
              aria-label="Filter public events by type"
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => setEventFilter('all')}
                aria-pressed={eventFilter === 'all'}
                className={`min-h-[34px] px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  eventFilter === 'all'
                    ? 'bg-[#18181b] text-white'
                    : 'bg-[#f2f2f3] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]'
                }`}
              >
                All ({events.length})
              </button>
              {summary.eventTypes.map((et) => (
                <button
                  key={et.type}
                  type="button"
                  onClick={() => setEventFilter(et.type)}
                  aria-pressed={eventFilter === et.type}
                  className={`min-h-[34px] px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    eventFilter === et.type
                      ? 'bg-[#c2410c] text-white'
                      : 'bg-[#f2f2f3] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]'
                  }`}
                >
                  {et.label} ({et.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {isRefreshing ? (
          <div aria-busy="true" className="space-y-2">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-14 animate-pulse bg-[#f2f2f3]" />
            ))}
          </div>
        ) : !eventsAvailable ? (
          <div className="bg-[#f2f2f3] p-5 text-sm text-[#52525b]">
            Public events could not be fetched from GitHub. This reflects an API
            fetch or rate-limit failure rather than zero activity.
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#f2f2f3] p-5 text-sm text-[#52525b]">
            {events.length === 0
              ? 'GitHub returned 0 public events in the last 90 days for this account.'
              : 'No events match the selected event type filter.'}
          </div>
        ) : (
          <ul
            data-testid="public-events-list"
            className="space-y-2"
          >
            {filteredEvents.slice(0, 40).map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1.5 bg-[#f2f2f3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 text-xs">
                    <span className="font-semibold text-[#c2410c]">
                      {humanizeEventType(event.type)}
                    </span>
                    <span aria-hidden="true" className="text-[#a3a2a5]">
                      ·
                    </span>
                    <a
                      href={event.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-[#18181b] hover:underline break-all"
                    >
                      {event.repoName}
                    </a>
                  </div>
                  <p className="text-sm text-[#3f3f46]">{event.summary}</p>
                </div>

                <span className="font-mono text-xs text-[#52525b] tabular-nums shrink-0">
                  {formatUtcDateTime(event.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
