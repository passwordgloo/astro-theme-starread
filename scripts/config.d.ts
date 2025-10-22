export interface starreadthemeconfig {
  site: {
    title: string;
    favicon: string;
    defaultCover: string;
    logo: {
      image: string;
      darkImage: string;
      text: string;
      alt: string;
    };
  };
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
  nav: Array<{
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
  categories: Array<{
    name: string;
    title: string;
  }>;
  sidebar: {
    home: {
      statsWidget: boolean;
      authorWidget: boolean;
      adWidget: boolean;
      tag: boolean;
      recommendedArticles: boolean;
    };
    article: {
      authorWidget: boolean;
      tag: boolean;
      toc: boolean;
    };
  };
  footer: {
    text: string;
  };
  articleLoad: {
    type: 'button' | 'auto';
    defaultLimit: number;
    initialLoad: number;
    loadMore: number;
  };
  search: {
    provider: 'local' | 'algolia';
    algolia: {
      enabled: boolean;
      appId: string;
      searchKey: string;
      indexName: string;
      writeApiKey: string;
    };
  };
  carousel: {
    title: string;
  };
}