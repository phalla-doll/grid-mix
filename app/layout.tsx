import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { geist } from './fonts';
import './globals.css'; // Global styles

export const metadata: Metadata = {
    metadataBase: new URL('https://soro.manthaa.dev/'),
    title: 'Soro | Ambient Sound Mixer',
    description:
        'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
    openGraph: {
        title: 'Soro | Ambient Sound Mixer',
        description:
            'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
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
        description:
            'A developer-style minimalist ambient sound mixer with a sharp geometric UI.',
        images: ['/soro-og-image-main.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${geist.variable} font-sans`}>
            <body suppressHydrationWarning className="antialiased">
                {children}
            </body>
            <GoogleAnalytics gaId="G-Z39E97C4FQ" />
        </html>
    );
}
