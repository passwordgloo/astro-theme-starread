/**
 * Starread 主题配置接口
 * 
 * 这个配置文件定义了整个网站的外观和功能设置。
 * 你可以通过修改 starread.config.ts 文件来自定义你的博客。
 */
export interface starreadthemeconfig {
  /**
   * 网站基本信息配置
   */
  site: {
    /** 网站标题，显示在浏览器标签和首页 */
    title: string;
    /** 网站图标路径，建议放在 /public 目录下 */
    favicon: string;
    /** 默认封面图路径，用于没有设置封面的文章 */
    defaultCover: string;
    /** 建站日期，格式：YYYY-MM-DD，用于计算建站天数 */
    foundedDate?: string;
    /** Logo 配置 */
    logo: {
      /** 亮色模式下的 logo 路径 */
      image: string;
      /** 暗色模式下的 logo 路径 */
      darkImage: string;
      /** Logo 旁边的文字 */
      text: string;
      /** Logo 的 alt 文本 */
      alt: string;
    };
    /** 文章相关配置 */
    article: {
      /** 文章加载配置 */
      articleLoad: {
        /** 加载类型：'button' 按钮加载 或 'auto' 自动加载 */
        type: 'button' | 'auto';
        /** 默认最大加载数量 */
        defaultLimit: number;
        /** 初始加载数量 */
        initialLoad: number;
        /** 每次加载更多时的数量 */
        loadMore: number;
      };
      /** 封面图片配置 */
      coverImage: {
        /** 默认宽高比，支持的比例：16:9, 4:3, 3:2 */
        defaultAspectRatio: string;
      };
    };
    /** 底部版权信息 */
    footer: {
      /** 底部显示的版权文字 */
      text: string;
    };
  };

  /**
   * 小部件配置
   */
  widget: {
    /** 作者信息配置 */
    author: {
      /** 作者姓名 */
      name: string;
      /** 作者简介 */
      description: string;
      /** 头像路径或 URL */
      avatar: string;
      /** 社交媒体链接，键名自定义 */
      social: Record<string, string>;
    };
    /** 广告小部件配置 */
    ad: {
      /** 广告标题 */
      title: string;
      /** 广告描述 */
      description: string;
      /** 按钮文字 */
      buttonText: string;
      /** 广告链接 */
      link: string;
    };
    /** 文章分类配置 */
    categories: Array<{
      /** 分类的标识符（用于 URL） */
      name: string;
      /** 分类的显示名称 */
      title: string;
    }>;
    /** 轮播图配置 */
    carousel: {
      /** 轮播图标题 */
      title: string;
    };
    /** Banner配置 */
    banner: {
      /** Banner标题 */
      title: string;
      /** 背景图片URL */
      backgroundImage: string;
      /** 标签列表 */
      tags: string[];
    };
  };

  /**
   * 导航菜单配置
   * 支持多级嵌套菜单结构
   */
  navbar: Array<{
    /** 菜单名称 */
    name?: string;
    /** 链接地址 */
    href?: string;
    /** 图标类名，使用 iconify 图标库 */
    icon?: string;
    /** 子菜单项 */
    items?: Array<{
      /** 分组标题 */
      text?: string;
      /** 子菜单项 */
      items?: Array<{
        /** 菜单文字 */
        text: string;
        /** 链接地址 */
        link: string;
        /** 图标类名 */
        icon?: string;
      }>;
    }>;
  }>;

  /**
   * 侧边栏组件显示控制
   */
  sidebar: {
    /** 首页侧边栏配置 */
    home: {
      /** 是否显示统计小部件（文章数、分类数等） */
      statsWidget: boolean;
      /** 是否显示作者信息 */
      authorWidget: boolean;
      /** 是否显示广告小部件 */
      adWidget: boolean;
      /** 是否显示标签云 */
      tag: boolean;
      /** 是否显示推荐文章 */
      recommendedArticles: boolean;
      /** 是否显示站点统计 */
      statistic: boolean;
    };
    /** 文章页侧边栏配置 */
    article: {
      /** 是否显示作者信息 */
      authorWidget: boolean;
      /** 是否显示标签 */
      tag: boolean;
      /** 是否显示目录（Table of Contents） */
      toc: boolean;
    };
  };
}