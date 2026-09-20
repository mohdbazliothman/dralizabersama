export type SocialContent = {
  id: string;
  platform: 'Facebook' | 'TikTok';
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
  date: string;
  category: string;
  featured: boolean;
};
