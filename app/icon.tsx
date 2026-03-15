import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';

export function generateImageMetadata() {
  return [
    { id: 'favicon-16', size: { width: 16, height: 16 }, alt: 'Soro' },
    { id: 'favicon-32', size: { width: 32, height: 32 }, alt: 'Soro' },
    { id: 'icon-192', size: { width: 192, height: 192 }, alt: 'Soro' },
    { id: 'icon-512', size: { width: 512, height: 512 }, alt: 'Soro' },
  ];
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10%', height: '50%', width: '60%', justifyContent: 'center' }}>
          <div style={{ width: '20%', height: '60%', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '20%', height: '100%', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '20%', height: '80%', background: 'white', borderRadius: '2px' }} />
        </div>
      </div>
    ),
    {
      width: id === 'favicon-16' ? 16 : id === 'favicon-32' ? 32 : id === 'icon-192' ? 192 : 512,
      height: id === 'favicon-16' ? 16 : id === 'favicon-32' ? 32 : id === 'icon-192' ? 192 : 512,
    }
  );
}
