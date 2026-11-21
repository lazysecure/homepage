import type { GitHubRepo } from '@/lib/github-types';
import { formatUtcDate } from '@/lib/github-logic';
import { cn } from '@/lib/utils';
import { MetroIcon } from './MetroIcon';

export type MetroTileVariant = 'light' | 'charcoal';

interface RepoRowProps {
  repo: GitHubRepo;
  compact?: boolean;
  variant?: MetroTileVariant;
}

export function RepoRow({
  repo,
  compact = false,
  variant = 'light',
}: RepoRowProps) {
  const updatedLabel = formatUtcDate(repo.pushedAt ?? repo.updatedAt);
  const isCharcoal = variant === 'charcoal';

  return (
    <article
      className={cn(
        'metro-tile group flex min-h-[156px] flex-col justify-between gap-4 p-5',
        isCharcoal
          ? 'bg-[#18181b] text-white hover:bg-[#222226]'
          : 'bg-[#f2f2f3] text-[#18181b] hover:bg-[#e7e7ea]'
      )}
    >
      {/* Top metadata + peek description (Metro Live Tile top area) */}
      <div className="space-y-2">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-2 text-xs',
            isCharcoal ? 'text-[#a3a2a5]' : 'text-[#52525b]'
          )}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span
              className={cn(
                'font-semibold',
                isCharcoal ? 'text-[#fb923c]' : 'text-[#18181b]'
              )}
            >
              {repo.language ?? 'Language unspecified'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <MetroIcon name="star-empty" className="text-[11px]" />
              <span>{repo.stargazersCount}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <MetroIcon name="flow-branch" className="text-[11px]" />
              <span>{repo.forksCount}</span>
            </span>
            {repo.fork && (
              <>
                <span aria-hidden="true">·</span>
                <span>Fork</span>
              </>
            )}
            {repo.archived && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#ea580c]">Archived</span>
              </>
            )}
          </div>

          <span className="font-mono tabular-nums shrink-0">
            {updatedLabel}
          </span>
        </div>

        <p
          className={cn(
            'text-sm leading-relaxed',
            isCharcoal ? 'text-[#d4d4d8]' : 'text-[#3f3f46]'
          )}
        >
          {repo.description ?? 'No repository description provided on GitHub.'}
        </p>

        {!compact && repo.topics.length > 0 && (
          <p
            className={cn(
              'font-mono text-xs',
              isCharcoal ? 'text-[#a3a2a5]' : 'text-[#52525b]'
            )}
          >
            {repo.topics.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>

      {/* Bottom-left Metro Tile Label + bottom-right action */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 pt-2">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-1.5 font-mono text-base font-semibold transition-colors break-all',
            isCharcoal
              ? 'text-white group-hover:text-[#fb923c]'
              : 'text-[#18181b] group-hover:text-[#c2410c]'
          )}
        >
          <span>{repo.name}</span>
          <MetroIcon name="arrow-up-right" className="text-[12px] shrink-0" />
        </a>

        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-xs font-medium underline underline-offset-4 whitespace-nowrap',
              isCharcoal ? 'text-[#a3a2a5] hover:text-white' : 'text-[#52525b] hover:text-[#18181b]'
            )}
          >
            Homepage
          </a>
        )}
      </div>
    </article>
  );
}
