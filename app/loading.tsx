export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page content"
      className="space-y-8"
    >
      <div className="space-y-2.5">
        <div className="h-9 w-44 animate-pulse bg-[#e7e7ea]" />
        <div className="h-4 w-80 max-w-full animate-pulse bg-[#f2f2f3]" />
      </div>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="h-36 animate-pulse bg-[#f2f2f3]" />
        ))}
      </div>
    </div>
  );
}
