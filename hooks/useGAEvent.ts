'use client';

import { useCallback } from 'react';

type GAEventParams = {
    action: string;
    category: string;
    label?: string;
    value?: number;
};

declare global {
    interface Window {
        gtag: (
            command: 'event',
            eventName: string,
            params?: Record<string, string | number | undefined>
        ) => void;
    }
}

export function useGAEvent() {
    const trackEvent = useCallback(
        ({ action, category, label, value }: GAEventParams) => {
            if (typeof window === 'undefined' || !window.gtag) return;

            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        },
        []
    );

    const trackClick = useCallback(
        (category: string, label: string, value?: number) => {
            trackEvent({ action: 'click', category, label, value });
        },
        [trackEvent]
    );

    const trackChange = useCallback(
        (category: string, label: string, value?: number) => {
            trackEvent({ action: 'change', category, label, value });
        },
        [trackEvent]
    );

    return { trackEvent, trackClick, trackChange };
}
