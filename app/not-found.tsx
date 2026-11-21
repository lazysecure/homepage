import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="max-w-lg space-y-4 bg-[#111113] p-6 text-white">
      <h1 className="text-2xl font-light tracking-tight">Page not found</h1>
      <p className="text-sm text-[#d4d4d8]">
        The requested route does not exist in this workspace.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-[40px] items-center bg-[#c2410c] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ea580c]"
      >
        Return Home
      </Link>
    </section>
  );
}
