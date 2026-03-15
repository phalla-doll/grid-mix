import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';

export function generateImageMetadata() {
  return [
    { id: 'apple-touch-icon-180', size: { width: 180, height: 180 }, alt: 'Soro' },
    { id: 'apple-touch-icon-152', size: { width: 152, height: 152 }, alt: 'Soro' },
    { id: 'apple-touch-icon-120', size: { width: 120, height: 120 }, alt: 'Soro' },
  ];
}

export default function AppleIcon({ id }: { id: string }) {
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10%', height: '50%', width: '60%', justifyContent: 'center' }}>
          <div style={{ width: '20%', height: '60%', background: 'white', borderRadius: '4px' }} />
          <div style={{ width: '20%', height: '100%', background: 'white', borderRadius: '4px' }} />
          <div style={{ width: '20%', height: '80%', background: 'white', borderRadius: '4px' }} />
        </div>
      </div>
    ),
    {
      width: id === 'apple-touch-icon-180' ? 180 : id === 'apple-touch-icon-152' ? 152 : 120,
      height: id === 'apple-touch-icon-180' ? 180 : id === 'apple-touch-icon-152' ? 152 : 120,
    }
  );
}
