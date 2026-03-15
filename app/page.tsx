import React from 'react';
import { MixerProvider } from '@/lib/mixer-context';
import { ClientApp } from '@/components/ClientApp';

export default function Home() {
    return (
        <MixerProvider>
            <ClientApp />
        </MixerProvider>
    );
}
