export type NavigationDirection = -1 | 0 | 1;

/**
 * Official Windows 8.1 WinJS.UI.Animation.enterPage easing curve and timings
 * (cubic-bezier(0.1, 0.9, 0.2, 1), 170ms opacity fade, 83ms stagger capped at 333ms).
 */
export const METRO_EASE = [0.1, 0.9, 0.2, 1] as const;
export const METRO_OPACITY_DURATION = 0.17;
export const METRO_PAGE_TRANSFORM_DURATION = 0.85;
export const METRO_PIVOT_TRANSFORM_DURATION = 0.55;
export const METRO_PIVOT_INDICATOR_DURATION = 0.36;

export function getWin8StaggerDelay(sectionIndex: number): number {
  if (sectionIndex <= 0) return 0;
  return Math.min(sectionIndex * 0.083, 0.333);
}

export function normalizeRoutePath(path: string): string {
  const withoutQuery = path.split(/[?#]/)[0] ?? '/';
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery || '/';
}

export function resolveNavOrderIndex(
  path: string,
  navPaths: readonly string[]
): number {
  const normalized = normalizeRoutePath(path);
  return navPaths.findIndex((item) => normalizeRoutePath(item) === normalized);
}

export function computeRouteDirection(
  fromPath: string | null,
  toPath: string,
  navPaths: readonly string[]
): NavigationDirection {
  if (!fromPath) return 0;

  const fromNorm = normalizeRoutePath(fromPath);
  const toNorm = normalizeRoutePath(toPath);
  if (fromNorm === toNorm) return 0;

  const fromIdx = resolveNavOrderIndex(fromNorm, navPaths);
  const toIdx = resolveNavOrderIndex(toNorm, navPaths);

  if (fromIdx === -1 || toIdx === -1) return 1;
  return toIdx > fromIdx ? 1 : -1;
}
