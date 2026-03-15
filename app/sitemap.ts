import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
        return siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
    }

    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
        return `https://${vercelUrl}`;
    }

    return 'http://localhost:3000';
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = getBaseUrl();

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];
}
