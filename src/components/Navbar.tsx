import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors"
        >
          <span>⚽</span>
          <span>World Cup 2026</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          <Link
            href="/matches"
            className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Matches
          </Link>
          <Link
            href="/matches"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Tickets
          </Link>
        </div>

      </div>
    </nav>
  );
}