/**
 * StarRead主题配置接口定义
 * 该接口描述了StarRead主题的所有可配置选项
 */
export interface starreadthemeconfig {
  /**
   * 网站基本信息配置
   */
  site: {
    /** 网站标题 */
    title: string;
    /** 网站favicon图标路径 */
    favicon: string;
    /** 默认文章封面图路径 */
    defaultCover: string;
    /** 网站logo配置 */
    logo: {
      /** 普通模式下的logo图片路径 */
      image: string;
      /** 深色模式下的logo图片路径 */
      darkImage: string;
      /** logo文字（当图片不存在时显示） */
      text: string;
      /** logo图片alt属性 */
      alt: string;
    };
  };

  /**
   * 作者信息配置
   */
  author: {
    /** 作者名称 */
    name: string;
    /** 作者描述 */
    description: string;
    /** 作者头像图片路径 */
    avatar: string;
    /** 作者社交媒体链接，键为平台名称，值为链接 */
    social: Record<string, string>;
  };

  /**
   * 广告小部件配置
   */
  ad: {
    /** 广告标题 */
    title: string;
    /** 广告描述文本 */
    description: string;
    /** 广告按钮文本 */
    buttonText: string;
    /** 广告链接地址 */
    link: string;
  };

  /**
   * 导航菜单配置
   * 数组中的每个对象代表一个导航项
   */
  nav: Array<{
    /** 导航项名称 */
    name?: string;
    /** 导航项链接地址 */
    href?: string;
    /** 导航项图标，使用iconify图标名称 */
    icon?: string;
    /** 下拉子菜单配置 */
    items?: Array<{
      /** 子菜单分组标题 */
      text?: string;
      /** 子菜单项列表 */
      items?: Array<{
        /** 子菜单项文本 */
        text: string;
        /** 子菜单项链接 */
        link: string;
        /** 子菜单项图标 */
        icon?: string;
      }>;
    }>;
  }>;

  /**
   * 文章分类配置
   */
  categories: Array<{
    /** 分类标识（用于URL和内部引用） */
    name: string;
    /** 分类显示名称 */
    title: string;
  }>;

  /**
   * 侧边栏配置
   * 控制不同页面的侧边栏显示内容
   */
  sidebar: {
    /** 首页侧边栏配置 */
    home: {
      /** 是否显示统计小部件 */
      statsWidget: boolean;
      /** 是否显示作者信息小部件 */
      authorWidget: boolean;
      /** 是否显示广告小部件 */
      adWidget: boolean;
      /** 是否显示标签云 */
      tag: boolean;
      /** 是否显示推荐文章 */
      recommendedArticles: boolean;
    };
    /** 文章页侧边栏配置 */
    article: {
      /** 是否显示作者信息小部件 */
      authorWidget: boolean;
      /** 是否显示标签列表 */
      tag: boolean;
      /** 是否显示文章目录 */
      toc: boolean;
    };
  };

  /**
   * 页脚配置
   */
  footer: {
    /** 页脚显示文本 */
    text: string;
  };

  /**
   * 文章加载配置
   * 控制文章列表的加载方式
   */
  articleLoad: {
    /** 加载类型：'button'（按钮加载更多）或 'auto'（滚动自动加载） */
    type: 'button' | 'auto';
    /** 默认最大加载文章数量 */
    defaultLimit: number;
    /** 初始加载文章数量 */
    initialLoad: number;
    /** 每次加载更多时增加的文章数量 */
    loadMore: number;
  };

  /**
   * 搜索功能配置
   */
  search: {
    /** 搜索提供者：'local'（本地搜索）或 'algolia'（Algolia搜索） */
    provider: 'local' | 'algolia';
  };

  /**
   * 轮播图配置
   */
  carousel: {
    /** 轮播图标题 */
    title: string;
  };
}