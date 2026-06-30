export interface StatisticProps {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
}

export interface ArticleTOCProps {
  isSticky?: boolean;
}

export interface CarouselProps {
  articles: Array<{
    id: string;
    data: {
      date?: string | Date;
      cover?: string;
      author?: {
        name?: string;
        avatar?: string;
      };
      categories?: string[];
    };
  }>;
}

export interface ArticleSectionProps {
  articles: Array<{
    id: string;
    data: {
      title: string;
      date?: string | Date;
      cover?: string;
      categories?: string[];
      tags?: string[];
      description?: string;
    };
  }>;
  limit?: number;
}

export interface LatestArticleProps {
  articles: Array<{
    id: string;
    data: {
      title: string;
      date?: string | Date;
      cover?: string;
      categories?: string[];
      tags?: string[];
      description?: string;
    };
  }>;
}

export interface ArticleNavProps {
  articles: Array<{
    id: string;
    data: {
      title: string;
      categories?: string[];
      tags?: string[];
    };
  }>;
}

export interface NavBarProps {
  title?: string;
}

export interface SearchProps {
  placeholder?: string;
}

export interface TagCloudProps {
  tagCounts: Record<string, number>;
}

export interface AuthorWidgetProps {
  name?: string;
  description?: string;
  avatar?: string;
  social?: Record<string, string>;
}

export interface AdWidgetProps {
  title?: string;
  description?: string;
  buttonText?: string;
  link?: string;
}

export interface BannerProps {
  title?: string;
  backgroundImage?: string;
  tags?: string[];
}

export interface ArticleInfoProps {
  title?: string;
  date?: string | Date;
  author?: {
    name?: string;
    avatar?: string;
  };
  categories?: string[];
  tags?: string[];
  views?: number;
}
