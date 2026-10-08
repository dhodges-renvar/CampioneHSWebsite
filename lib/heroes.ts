/* ============================================================================
   HERO PHOTOGRAPHY
   ----------------------------------------------------------------------------
   Background images appear in hero sections and nowhere else on this site.
   Until real job photography exists, every hero renders a built field — ink,
   a raked wash in the division colour, and fine grain. It is designed to look
   finished on its own, so the site can launch today.

   TO ADD A PHOTO (one line each):
     1. Drop the file in  /public/img/hero/
        Name it after the key below, e.g.  painting.jpg
        Shoot or crop to 2400 × 1350 (16:9), export JPG at quality 72–78,
        aim for under 350 KB. Darker frames work best — the scrim is tuned
        for text over a dark left third.
     2. Set the path here. The built field stays underneath, so a photo with
        transparency or an off crop still reads correctly.
     3. `focus` sets background-position. Use it to keep the subject out from
        behind the headline — 'right center' is usually right for a left-
        aligned hero.
   ========================================================================== */

export type Hero = { src: string; focus?: string };

export const HERO_IMAGES: Record<string, Hero> = {
  home: { src: '', focus: 'right center' },
  services: { src: '', focus: 'center' },
  about: { src: '', focus: 'center' },
  contact: { src: '', focus: 'center' },
  'service-area': { src: '', focus: 'center' },

  painting: { src: '', focus: 'right center' },
  drywall: { src: '', focus: 'right center' },
  exteriors: { src: '', focus: 'right center' },
  'pressure-washing': { src: '', focus: 'right center' },
  cleaning: { src: '', focus: 'right center' },
  'construction-management': { src: '', focus: 'right center' },
};

export const heroFor = (key: string): Hero => HERO_IMAGES[key] ?? { src: '' };
