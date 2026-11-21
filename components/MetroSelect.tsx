'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { MetroIcon } from './MetroIcon';

export interface MetroSelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface MetroSelectProps<T extends string = string> {
  id: string;
  labelId?: string;
  value: T;
  options: readonly MetroSelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function MetroSelect<T extends string = string>({
  id,
  labelId,
  value,
  options,
  onChange,
  className,
}: MetroSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const shouldReduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((opt) => opt.value === value)
    )
  );

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );
  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const openMenu = () => {
    const idx = Math.max(
      0,
      options.findIndex((opt) => opt.value === value)
    );
    setActiveIndex(idx);
    setOpen(true);
  };

  const selectValue = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (options.length === 0) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((prev) => (prev + 1) % options.length);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          setActiveIndex((prev) =>
            prev <= 0 ? options.length - 1 : prev - 1
          );
        }
        break;
      }
      case 'Home': {
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      }
      case 'End': {
        if (open) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (options[activeIndex]) {
          selectValue(options[activeIndex].value);
        }
        break;
      }
      case 'Escape': {
        if (open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case 'Tab': {
        if (open) {
          setOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const activeOption = open ? options[activeIndex] : undefined;

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Windows Desktop ComboBox: Text/Selection box + integrated right DropDown Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelId ? `${labelId} ${id}` : undefined}
        aria-activedescendant={
          activeOption ? `${listboxId}-opt-${activeOption.value}` : undefined
        }
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'group flex h-10 w-full items-stretch border-2 bg-white text-left text-sm text-[#18181b] transition-colors',
          open
            ? 'border-[#18181b] focus-visible:outline-none'
            : 'border-[#a3a2a5] hover:border-[#18181b] focus:border-[#18181b]'
        )}
      >
        <span className="flex flex-1 items-center truncate px-3 font-normal">
          {selectedOption?.label}
        </span>
        <span
          className={cn(
            'flex w-9 shrink-0 items-center justify-center border-l-2 transition-colors',
            open
              ? 'border-[#18181b] bg-[#e7e7ea]'
              : 'border-[#a3a2a5] bg-[#f2f2f3] group-hover:border-[#18181b] group-hover:bg-[#e7e7ea]'
          )}
        >
          <MetroIcon
            name="chevron-thin-down"
            className="text-[13px] text-[#18181b]"
          />
        </span>
      </button>

      {/* Flush Windows DropDown List anchored directly below the ComboBox header */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            initial={shouldReduceMotion ? false : { opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.09 }}
            className="absolute left-0 right-0 top-full z-40 -mt-[2px] max-h-60 overflow-y-auto border-2 border-[#18181b] bg-white p-0"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li
                  key={option.value}
                  id={`${listboxId}-opt-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectValue(option.value);
                  }}
                  className={cn(
                    'flex h-9 cursor-pointer items-center px-3 text-sm transition-colors select-none',
                    isActive
                      ? 'bg-[#c2410c] font-semibold text-white'
                      : isSelected
                        ? 'bg-[#f2f2f3] font-semibold text-[#18181b]'
                        : 'bg-white text-[#18181b]'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
