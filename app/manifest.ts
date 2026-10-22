import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.elevator,
    start_url: '/',
    display: 'browser',
    background_color: '#f6f6f4',
    theme_color: '#0e1114',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      // Android home-screen installs want raster. Maskable so the launcher can
      // crop to whatever shape the device uses without clipping the mark.
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
