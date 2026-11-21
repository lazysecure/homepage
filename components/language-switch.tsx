"use client";

import { usePathname } from "next/navigation";

export function LanguageSwitch() {
  const pathname = usePathname();
  const isKorean = pathname === "/ko" || pathname.startsWith("/ko/");
  return (
    <a
      className="language-link"
      href={isKorean ? "/" : "/ko"}
      lang={isKorean ? "en" : "ko"}
      aria-label={isKorean ? "Switch language to English" : "한국어로 전환"}
    >
      {isKorean ? "English" : "한국어"}
    </a>
  );
}
