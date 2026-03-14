import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GridMix | Ambient Sound Mixer',
  description: 'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="antialiased">{children}</body>
    </html>
  );
}
