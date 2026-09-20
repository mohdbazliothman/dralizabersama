import type { SocialContent } from '@/types/social';

// Masukkan hanya pautan hantaran/video sebenar yang diluluskan pasukan.
// Tarikh ISO YYYY-MM-DD. Thumbnail tempatan dalam public/images/.
// Item tanpa URL sah tidak dipaparkan. Satu featured + sehingga lima item lain.
export const socialContent: SocialContent[] = [];

export const officialChannels = {
  facebook: 'https://www.facebook.com/BersamaDrAliza',
  tiktok: null,
  instagram: null,
  whatsapp: null,
} satisfies Record<string, string | null>;
