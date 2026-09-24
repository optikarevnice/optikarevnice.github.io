import type { ImageMetadata } from 'astro';
import { gallery } from './data';

// Pages CMS stores uploads in src/assets/gallery and writes paths like
// "/src/assets/gallery/photo.jpg". Resolving them through import.meta.glob lets
// Astro optimise every photo (resize, WebP/AVIF) at build time.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export const photos = gallery.photos.flatMap((photo) => {
  const key = photo.image.startsWith('/') ? photo.image : `/${photo.image}`;
  const file = files[key];
  if (!file) {
    // Skip rather than fail, so one bad entry never blocks publishing other edits.
    console.warn(`[gallery] Image not found, skipping: ${photo.image} (expected in src/assets/gallery)`);
    return [];
  }
  return [{ ...photo, src: file.default }];
});
