import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'World Cup 2026 Fan Hub',
    template: '%s | World Cup 2026 Fan Hub',
  },
  description:
    'Your complete guide to tickets, stadiums, and travel for the 2026 FIFA World Cup.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <Navbar />
        <div className="min-h-screen">
          {children}
        </div>
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            <p>⚽ World Cup 2026 Fan Hub — Fan information platform</p>
            <p className="mt-1">
              Not affiliated with FIFA. Ticket information is provided for reference only.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}