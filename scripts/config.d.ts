export interface StarreadThemeConfig {
  language: 'zh' | 'en';

  hero?: {
    enabled?: boolean;
    backgroundImage?: string;
    title?: {
      mode?: 'text' | 'jinrishici';
      content?: string;
    };
    effect?: {
      gradient?: {
        enabled?: boolean;
        colors?: string[];
      };
      typing?: {
        enabled?: boolean;
        repeat?: boolean;
        cursor?: boolean;
        cursorStyle?: 'line' | 'block';
      };
      particles?: {
        enabled?: boolean;
      };
    };
  };

  site: {
    title: string;
    favicon: string;
    defaultCover: string;
    foundedDate?: string;
    loginUrl?: string;
    logo: {
      image: string;
      darkImage: string;
      text: string;
      alt: string;
    };
    LatestArticle: {
      type: 'button' | 'auto';
      layout: 'horizontal' | 'vertical';
      defaultLimit: number;
      initialLoad: number;
      loadMore: number;
      columns: number;
      defaultAspectRatio: string;
      horizontalHeight: string;
    };
    footer: {
      text: string;
    };
  };

  widget: {
    author: {
      name: string;
      description: string;
      avatar: string;
      social: Record<string, string>;
    };
    ad: {
      title: string;
      description: string;
      buttonText: string;
      link: string;
    };
    categories: Array<{
      name: string;
      title: string;
    }>;
    carousel: {
      title: string;
      layout: 'horizontal' | 'vertical';
    };
    banner: {
      title: string;
      backgroundImage: string;
      tags: string[];
    };
  };

  navbar: Array<{
    name?: string;
    href?: string;
    icon?: string;
    items?: Array<{
      text?: string;
      items?: Array<{
        text: string;
        link: string;
        icon?: string;
      }>;
    }>;
  }>;

  dynamicEffect?: {
    postTopWave: boolean;
  };

  sidebar: {
    home: {
      progress: boolean;
      statsWidget: boolean;
      authorWidget: boolean;
      adWidget: boolean;
      tag: boolean;
      recommendedArticles: boolean;
      statistic: boolean;
    };
    article: {
      authorWidget: boolean;
      tag: boolean;
      toc: boolean;
    };
  };
}
