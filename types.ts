
export enum Category {
  ALL = 'Все работы',
  ARCHITECTURAL = 'Архитектурная съемка',
  EVENTS = 'Мероприятия',
  SOCIAL = 'Контент для соц сетей',
  AI_GENERATION = 'ИИ генерации'
}

export type VkEmbedType = 'iframe' | 'post';

export interface VkPostConfig {
  elementId: string;
  ownerId: number;
  postId: number;
  hash: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: Category | Category[];
  imageUrl: string;
  description?: string;
  isVertical?: boolean;
  isSquare?: boolean;
  
  // Video source
  videoUrl?: string;
  videos?: { title?: string, url: string, isVertical?: boolean }[];
  
  // Legacy VK support
  vkEmbedType?: VkEmbedType;
  vkIframeSrc?: string;
  vkPostConfig?: VkPostConfig;
}

export interface NavLink {
  label: string;
  href: string;
}

export type Page = 'portfolio' | 'why_us' | 'team' | 'contacts' | 'pricing' | 'journal';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  videoUrl?: string;
  showContactCTA?: boolean;
}
