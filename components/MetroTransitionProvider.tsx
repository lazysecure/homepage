'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { siteConfig } from '@/config/site';
import {
  computeRouteDirection,
  normalizeRoutePath,
  type NavigationDirection,
} from '@/lib/navigation-motion';

interface MetroTransitionContextValue {
  direction: NavigationDirection;
}

const MetroTransitionContext = createContext<MetroTransitionContextValue>({
  direction: 0,
});

export function useMetroTransition() {
  return useContext(MetroTransitionContext);
}

const NAV_PATHS = siteConfig.navigation.map((item) => item.href);

export function MetroTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = normalizeRoutePath(pathname);
  const lastCommittedPathRef = useRef(normalizedPath);
  const [direction, setDirection] = useState<NavigationDirection>(0);

  useEffect(() => {
    lastCommittedPathRef.current = normalizedPath;
  }, [normalizedPath]);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizeRoutePath(window.location.pathname);
      const nextDir = computeRouteDirection(
        lastCommittedPathRef.current,
        nextPath,
        NAV_PATHS
      );
      setDirection(nextDir);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#')) return;

      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;

      const nextDir = computeRouteDirection(
        lastCommittedPathRef.current,
        targetUrl.pathname,
        NAV_PATHS
      );
      if (nextDir !== 0) {
        setDirection(nextDir);
      }
    },
    []
  );

  const contextValue = useMemo(() => ({ direction }), [direction]);

  return (
    <MotionConfig reducedMotion="user">
      <MetroTransitionContext.Provider value={contextValue}>
        <div
          onClickCapture={handleClickCapture}
          className="flex min-h-screen flex-col"
        >
          {children}
        </div>
      </MetroTransitionContext.Provider>
    </MotionConfig>
  );
}
