'use client';

import type { FetchStatus, RateLimitInfo } from '@/lib/github-types';
import { formatUtcDateTime } from '@/lib/github-logic';
import { MetroIcon } from './MetroIcon';

interface DataStatusBannerProps {
  status: FetchStatus;
  errorMessage: string | null;
  rateLimit?: RateLimitInfo;
  onRetry?: () => void;
  retrying?: boolean;
}

export function DataStatusBanner({
  status,
  errorMessage,
  rateLimit,
  onRetry,
  retrying = false,
}: DataStatusBannerProps) {
  if (status === 'ok') {
    return null;
  }

  const isRateLimit = status === 'rate_limited';

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-3 bg-[#f2f2f3] p-4 text-[#18181b] sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        {isRateLimit ? (
          <MetroIcon
            name="warning"
            className="mt-0.5 shrink-0 text-[15px] text-[#ea580c]"
          />
        ) : (
          <MetroIcon
            name="info"
            className="mt-0.5 shrink-0 text-[15px] text-[#52525b]"
          />
        )}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#18181b]">
            {isRateLimit
              ? 'GitHub API rate limit reached'
              : status === 'not_found'
                ? 'GitHub resource unavailable'
                : 'GitHub data temporarily unavailable'}
          </p>
          <p className="text-xs text-[#52525b]">
            {errorMessage ??
              'Could not load live data from GitHub. Unavailable data is not replaced with simulated entries.'}
          </p>
          {rateLimit && rateLimit.resetAt && (
            <p className="font-mono text-xs text-[#52525b] tabular-nums">
              Limit window resets: {formatUtcDateTime(rateLimit.resetAt)}
            </p>
          )}
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex min-h-[40px] items-center gap-2 self-start border-2 border-[#18181b] bg-white px-4 py-1.5 text-xs font-semibold text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white disabled:opacity-50 sm:self-center whitespace-nowrap shrink-0"
        >
          <MetroIcon
            name="loop2"
            className={`text-[13px] ${retrying ? 'animate-spin' : ''}`}
          />
          <span>{retrying ? 'Retrying...' : 'Retry fetch'}</span>
        </button>
      )}
    </div>
  );
}
