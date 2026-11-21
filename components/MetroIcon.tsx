import { cn } from '@/lib/utils';

export type MetroIconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-thin-down'
  | 'checkmark'
  | 'copy'
  | 'cross'
  | 'flow-branch'
  | 'github'
  | 'info'
  | 'loop2'
  | 'menu'
  | 'search'
  | 'star-empty'
  | 'warning';

interface MetroIconProps {
  name: MetroIconName;
  className?: string;
}

export function MetroIcon({ name, className }: MetroIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(`mif-${name} inline-block leading-none`, className)}
    />
  );
}
