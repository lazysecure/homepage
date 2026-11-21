'use client';

import { Children, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  METRO_EASE,
  METRO_OPACITY_DURATION,
  METRO_PAGE_TRANSFORM_DURATION,
  METRO_PIVOT_TRANSFORM_DURATION,
  getWin8StaggerDelay,
} from '@/lib/navigation-motion';
import { useMetroTransition } from './MetroTransitionProvider';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
}

export function MotionSection({ children, className }: MotionSectionProps) {
  const { direction } = useMetroTransition();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => {
        const delay = getWin8StaggerDelay(index);
        const isPivotNavigation = direction !== 0;

        return (
          <motion.div
            key={index}
            initial={
              isPivotNavigation
                ? { opacity: 0, x: direction * 52 }
                : { opacity: 0.94, y: 24 }
            }
            animate={
              isPivotNavigation ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
            }
            transition={{
              opacity: {
                duration: METRO_OPACITY_DURATION,
                delay,
                ease: METRO_EASE,
              },
              x: {
                duration: METRO_PIVOT_TRANSFORM_DURATION,
                delay,
                ease: METRO_EASE,
              },
              y: {
                duration: METRO_PAGE_TRANSFORM_DURATION,
                delay,
                ease: METRO_EASE,
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
