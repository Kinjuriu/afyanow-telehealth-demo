import Link from "next/link";

export default function DemoHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-sm shadow-indigo-200">
            A
          </span>
          <span className="text-lg font-semibold text-slate-900">
            Afya<span className="text-indigo-600">Now</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-indigo-700"
        >
          Exit demo
        </Link>
      </div>
    </header>
  );
}
