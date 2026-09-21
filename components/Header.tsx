import Link from "next/link";

export default function Header() {
  return (
    <header
      className="border-b border-white/10 backdrop-blur-md"
      style={{ backgroundColor: "color-mix(in srgb, #152535 75%, transparent)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-on-bg text-xl font-serif tracking-wide">
          命理談
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/input" className="text-on-bg-muted transition-colors hover:text-on-bg">
            사주 분석
          </Link>
        </nav>
      </div>
    </header>
  );
}
