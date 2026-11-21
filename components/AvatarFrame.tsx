'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AvatarFrameProps {
  src: string | null | undefined;
  alt: string;
  handle: string;
  size?: number;
}

export function AvatarFrame({
  src,
  alt,
  handle,
  size = 72,
}: AvatarFrameProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center bg-[#111113] font-mono text-sm font-semibold text-white"
        aria-label={alt}
      >
        {handle.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden bg-[#111113]"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
