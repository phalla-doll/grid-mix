import type {Metadata} from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { inter } from './fonts';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  metadataBase: new URL('https://soro.manthaa.dev/'),
  title: 'Soro | Ambient Sound Mixer',
  description: 'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
  openGraph: {
    title: 'Soro | Ambient Sound Mixer',
    description: 'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
    images: [
      {
        url: '/soro-og-image-main.png',
        width: 1200,
        height: 630,
        alt: 'Soro ambient sound mixer preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soro | Ambient Sound Mixer',
    description: 'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
    images: ['/soro-og-image-main.png'],
  },
  icons: {
    icon: [
      { url: '/icon/favicon-16', sizes: '16x16', type: 'image/png' },
      { url: '/icon/favicon-32', sizes: '32x32', type: 'image/png' },
      { url: '/icon/icon-192', sizes: '192x192', type: 'image/png' },
      { url: '/icon/icon-512', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon/apple-touch-icon-180', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon/apple-touch-icon-152', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon/apple-touch-icon-120', sizes: '120x120', type: 'image/png' },
    ],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body suppressHydrationWarning className="antialiased">{children}</body>
      <GoogleAnalytics gaId="G-Z39E97C4FQ" />
    </html>
  );
}
