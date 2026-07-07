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
 * Configuration Structure:
 * 1. Global settings (lang, favicon, logo, etc.)
 * 2. Navigation bar configuration
 * 3. Sidebar configuration
 * 4. Widget configurations
 * 5. Dynamic effects
 * 6. Multi-language configurations (locales, themeLocales)
 * 
 * @see {@link https://star.iglooblog.top/configure.html} I18n Guide
 */

/**
 * Site-level locale configuration
 * 
 * 站点级语言环境配置
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
 */
export interface ThemeLocale {
  /** Language label displayed in selector / 语言选择器中显示的标签 */
  selectLanguageName?: string;

  /** Language flag emoji / 语言国旗表情符号 */
  flag?: string;

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

  /** Navigation bar items (overrides global navbar) / 导航栏项目 */
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
 * 
 * Flat structure following VuePress 2 pattern:
 * - No nested site object
 * - Global settings at top level
 * - Multi-language settings at the end
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
   * Site favicon URL
   * 
   * 站点图标 URL
   */
  favicon: string;

  /**
   * Default cover image URL
   * 
   * 默认封面图片 URL
   */
  defaultCover: string;

  /**
   * Site founded date (for statistics)
   * 
   * 站点建立日期（用于统计）
   */
  foundedDate?: string;

  /**
   * Login page URL
   * 
   * 登录页面 URL
   */
  loginUrl?: string;

  /**
   * Logo configuration
   * 
   * Logo 配置
   */
  logo: {
    image: string;
    darkImage: string;
    text: string;
    alt: string;
  };

  /**
   * Hero section configuration
   * 
   * Hero 区域配置
   */
  hero?: HeroConfig;

  /**
   * Navigation bar configuration
   * 
   * 导航栏配置
   * 
   * Defines the navigation structure (links, icons, hierarchy)
   * Can be overridden in themeLocales for each language
   */
  navbar: NavItem[];

  /**
   * Sidebar component visibility configuration
   * 
   * 侧边栏组件显示控制配置
   * 
   * Controls which widgets are shown on sidebar
   * Text labels should be configured in themeLocales
   */
  sidebar: SidebarConfig;

  /**
   * Widget configurations
   * 
   * 小部件配置
   * 
   * Includes author, ad, categories, carousel, banner, LatestArticle
   * Text content should be configured in themeLocales
   */
  widget: WidgetConfig;

  /**
   * Dynamic effects configuration
   * 
   * 动态效果配置
   */
  dynamicEffect?: DynamicEffectConfig;

  /**
   * Site-level locales configuration
   * 
   * 站点级语言环境配置
   * 
   * Key format: '/' for default language, '/en/' for English, etc.
   * Contains site-wide settings like title, description
   */
  locales?: Record<string, SiteLocale>;

  /**
   * Theme-level locales configuration
   * 
   * 主题级语言环境配置
   * 
   * Key format: '/' for default language, '/en/' for English, etc.
   * Contains language-specific UI texts for widgets, sidebar, search, etc.
   */
  themeLocales?: Record<string, ThemeLocale>;
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
 * Widget configuration interface
 */
export interface WidgetConfig {
  /** Latest article widget configuration / 最新文章组件配置 */
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

  /** Author widget configuration / 作者信息配置 */
  author: {
    avatar: string;
    social: Record<string, string>;
  };

  /** Ad widget configuration / 广告配置 */
  ad: {
    link: string;
  };

  /** Categories configuration / 分类配置 */
  categories: Array<{
    name: string;
  }>;

  /** Carousel configuration / 轮播图配置 */
  carousel: {
    layout: 'horizontal' | 'vertical';
  };

  /** Banner configuration / 横幅配置 */
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