'use client';

import { useState } from 'react';
import type { ContactChannel } from '@/config/site';
import { MetroIcon } from './MetroIcon';

interface ContactLinksProps {
  channels: ContactChannel[];
}

export function ContactLinks({ channels }: ContactLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, value: string) => {
    let copied = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    }
  };

  return (
    <ul className="grid grid-cols-1 gap-2.5">
      {channels.map((channel, index) => {
        const isCopied = copiedId === channel.id;
        const isPrimary = index === 0;

        return (
          <li
            key={channel.id}
            className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
              isPrimary
                ? 'bg-[#18181b] text-white'
                : 'bg-[#f2f2f3] text-[#18181b]'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <p
                className={`text-xs font-semibold ${
                  isPrimary ? 'text-[#a3a2a5]' : 'text-[#52525b]'
                }`}
              >
                {channel.label}
              </p>
              <p
                className={`font-mono text-base font-semibold break-all ${
                  isPrimary ? 'text-white' : 'text-[#18181b]'
                }`}
              >
                {channel.value}
              </p>
              <p
                className={`text-xs ${
                  isPrimary ? 'text-[#d4d4d8]' : 'text-[#52525b]'
                }`}
              >
                {channel.note}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {channel.copyable && (
                <button
                  type="button"
                  onClick={() => handleCopy(channel.id, channel.value)}
                  aria-label={`Copy ${channel.label} value`}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 border-2 px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isPrimary
                      ? 'border-white bg-transparent text-white hover:bg-white hover:text-[#18181b]'
                      : 'border-[#18181b] bg-white text-[#18181b] hover:bg-[#18181b] hover:text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <MetroIcon
                        name="checkmark"
                        className="text-[13px] text-[#ea580c]"
                      />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <MetroIcon name="copy" className="text-[13px]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}

              {channel.href && (
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-[40px] items-center gap-1.5 bg-[#c2410c] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ea580c] whitespace-nowrap shrink-0"
                >
                  <span>Open</span>
                  <MetroIcon name="arrow-up-right" className="text-[12px]" />
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
