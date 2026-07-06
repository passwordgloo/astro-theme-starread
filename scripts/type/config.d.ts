/**
 * Starread Theme Configuration Interface
 * 
 * 星阅主题配置接口
 * 
 * Following VuePress 2's i18n pattern:
 * - Site-level locales for title, description, lang
 * - Theme-level locales for navbar, sidebar texts, etc.
 * - Top-level themeConfig for global settings
 * 
 * @see {@link https://vuepress.github.io/guide/i18n.html} VuePress I18n Guide
 */

/**
 * Site-level locale configuration
 * 
 * 站点级语言环境配置
 * 
 * Used for site-wide settings like title, description
 */
export interface SiteLocale {
  /** Language code (BCP47 format) / 语言代码（BCP47格式） */
  lang?: string;

  /** Site title / 站点标题 */
  title?: string;

  /** Site description / 站点描述 */
  description?: string;

  /** Footer text / 页脚文本 */
  footer?: {
    text?: string;
  };
}

/**
 * Theme-level locale configuration
 * 
 * 主题级语言环境配置
 * 
 * Used for theme-specific UI texts like navbar, sidebar, search
 */
export interface ThemeLocale {
  /** Language label displayed in selector / 语言选择器中显示的标签 */
  selectLanguageName?: string;

  /** Language flag emoji / 语言国旗表情符号 */
  flag?: string;

  /** Site-specific text / 站点文本 */
  site?: {
    title?: string;
    footer?: {
      text?: string;
    };
  };

  /** Widget-specific text / 小部件文本 */
  widget?: {
    author?: {
      name?: string;
      description?: string;
    };
    ad?: {
      title?: string;
      description?: string;
      buttonText?: string;
    };
    categories?: Array<{
      name: string;
      title: string;
    }>;
    carousel?: {
      title?: string;
    };
    banner?: {
      title?: string;
      tags?: string[];
    };
  };

  /** Navigation bar items (overrides global navbar) / 导航栏项目（覆盖全局导航栏） */
  navbar?: Array<{
    name?: string;
    text?: string;
    href?: string;
    icon?: string;
    items?: Array<{
      text?: string;
      items?: Array<{
        text: string;
        link?: string;
        icon?: string;
      }>;
    }>;
  }>;

  /** Sidebar widget text labels / 侧边栏组件文本标签 */
  sidebar?: {
    progress?: string;
    author?: string;
    ad?: string;
    tagcloud?: string;
    statistic?: string;
    toc?: string;
  };

  /** Search component text / 搜索组件文本 */
  search?: {
    placeholder?: string;
    noResults?: string;
    loading?: string;
    initialTip?: string;
    clear?: string;
    viewDetails?: string;
    shortcuts?: {
      open?: string;
      browse?: string;
      select?: string;
      close?: string;
    };
  };
}

/**
 * Theme configuration interface
 * 
 * 主题配置接口
 */
export interface StarreadThemeConfig {
  /**
   * Default language code
   * 
   * 默认语言代码
   * 
   * @default 'zh'
   */
  lang?: string;

  /**
   * Site-level locales configuration
   * 
   * 站点级语言环境配置
   * 
   * Key format: '/' for default language, '/en/' for English, etc.
   * Each locale contains site-wide settings like title, description
   */
  locales?: Record<string, SiteLocale>;

  /**
   * Hero section configuration
   * 
   * Hero 区域配置
   */
  hero?: HeroConfig;

  /**
   * Site-wide configuration
   * 
   * 站点全局配置
   * 
   * Includes logo, favicon, URLs, etc.
   * Text content should be configured in locales
   */
  site: SiteConfig;

  /**
   * Widget configurations
   * 
   * 小部件配置（全局）
   * 
   * Includes author, ad, categories, carousel, banner
   * Text content should be configured in theme.locales
   */
  widget: WidgetConfig;

  /**
   * Navigation bar configuration
   * 
   * 导航栏配置（全局）
   * 
   * Defines the navigation structure (links, icons, hierarchy)
   * Can be overridden in theme.locales for each language
   */
  navbar: NavItem[];

  /**
   * Theme-level locales configuration
   * 
   * 主题级语言环境配置
   * 
   * Key format: '/' for default language, '/en/' for English, etc.
   * Each locale contains language-specific UI texts
   */
  themeLocales?: Record<string, ThemeLocale>;

  /**
   * Dynamic effects configuration
   * 
   * 动态效果配置
   */
  dynamicEffect?: DynamicEffectConfig;

  /**
   * Sidebar component visibility configuration
   * 
   * 侧边栏组件显示控制配置（全局）
   * 
   * Controls which widgets are shown on sidebar
   * Text labels should be configured in themeLocales
   */
  sidebar: SidebarConfig;
}

/**
 * Hero section configuration interface
 */
export interface HeroConfig {
  enabled?: boolean;
  navbarTransparent?: boolean;
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
}

/**
 * Site configuration interface
 */
export interface SiteConfig {
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
}

/**
 * Widget configuration interface
 */
export interface WidgetConfig {
  author: {
    avatar: string;
    social: Record<string, string>;
  };
  ad: {
    link: string;
  };
  categories: Array<{
    name: string;
  }>;
  carousel: {
    layout: 'horizontal' | 'vertical';
  };
  banner: {
    backgroundImage: string;
  };
}

/**
 * Navigation item interface
 */
export interface NavItem {
  name?: string;
  text?: string;
  href?: string;
  icon?: string;
  items?: Array<{
    text?: string;
    items?: Array<{
      text: string;
      link?: string;
      icon?: string;
    }>;
  }>;
}

/**
 * Dynamic effect configuration interface
 */
export interface DynamicEffectConfig {
  postTopWave: boolean;
}

/**
 * Sidebar configuration interface
 */
export interface SidebarConfig {
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
}