/**
 * Starread 主题配置接口
 * 
 * 这个配置文件定义了整个网站的外观和功能设置。
 * 你可以通过修改 starread.config.ts 文件来自定义你的博客。
 * 
 * @example
 * ```typescript
 * export const themeConfig: starreadthemeconfig = {
 *   // 网站基本信息
 *   site: {
 *     title: '我的博客',
 *     favicon: '/favicon.ico',
 *     defaultCover: '/default-cover.jpg',
 *     logo: {
 *       image: '/logo-light.svg',
 *       darkImage: '/logo-dark.svg',
 *       text: '我的博客',
 *       alt: '博客Logo'
 *     }
 *   },
 * 
 *   // 作者信息
 *   author: {
 *     name: '张三',
 *     description: '热爱技术的开发者',
 *     avatar: '/avatar.jpg',
 *     social: {
 *       github: 'https://github.com/yourname',
 *       twitter: 'https://twitter.com/yourname',
 *       email: 'your@email.com'
 *     }
 *   },
 * 
 *   // 广告配置（可选）
 *   ad: {
 *     title: '推荐工具',
 *     description: '这是一个很棒的前端开发工具',
 *     buttonText: '立即查看',
 *     link: 'https://example.com'
 *   },
 * 
 *   // 导航菜单 - 支持多级嵌套
 *   nav: [
 *     { name: '首页', href: '/', icon: 'icon-[mdi--home]' },
 *     {
 *       name: '技术',
 *       icon: 'icon-[mdi--code]',
 *       items: [
 *         {
 *           text: '前端开发',
 *           items: [
 *             { text: 'React', link: '/category/react', icon: 'icon-[mdi--react]' },
 *             { text: 'Vue', link: '/category/vue', icon: 'icon-[mdi--vuejs]' }
 *           ]
 *         }
 *       ]
 *     }
 *   ],
 * 
 *   // 文章分类
 *   categories: [
 *     { name: 'tech', title: '技术' },
 *     { name: 'life', title: '生活' }
 *   ],
 * 
 *   // 侧边栏配置
 *   sidebar: {
 *     home: {
 *       statsWidget: true,      // 显示统计小部件
 *       authorWidget: true,     // 显示作者信息
 *       adWidget: true,         // 显示广告
 *       tag: true,              // 显示标签云
 *       recommendedArticles: true // 显示推荐文章
 *     },
 *     article: {
 *       authorWidget: true,     // 显示作者信息
 *       tag: true,              // 显示标签
 *       toc: true               // 显示目录
 *     }
 *   },
 * 
 *   // 底部版权信息
 *   footer: {
 *     text: '© 2025 我的博客 - 记录技术的点滴'
 *   },
 * 
 *   // 文章加载配置
 *   articleLoad: {
 *     type: 'auto',           // 'button' 按钮加载 或 'auto' 自动加载
 *     defaultLimit: 20,       // 默认最大加载数量
 *     initialLoad: 8,         // 初始加载数量
 *     loadMore: 4             // 每次加载数量
 *   },
 * 
 *   // 搜索配置
 *   search: {
 *     provider: 'local'        // 'local' 本地搜索 或 'algolia' Algolia搜索
 *   },
 * 
 *   // 轮播图配置
 *   carousel: {
 *     title: '精选文章'
 *   }
 * };
 * ```
 */
export interface starreadthemeconfig {
  /**
   * 网站基本信息配置
   * 
   * @example
   * site: {
   *   title: '星阅主题',
   *   favicon: '/favicon.svg',
   *   defaultCover: '/defaultCover.jpg',
   *   logo: {
   *     image: '/logo.svg',
   *     darkImage: '/logo-dark.svg',
   *     text: 'Lovestu',
   *     alt: 'Lovestu Logo'
   *   }
   * }
   */
  site: {
    /** 网站标题，显示在浏览器标签和首页 */
    title: string;
    /** 网站图标路径，建议放在 /public 目录下 */
    favicon: string;
    /** 默认封面图路径，用于没有设置封面的文章 */
    defaultCover: string;
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
  };

  /**
   * 作者信息配置
   * 
   * @example
   * author: {
   *   name: '风雅中华',
   *   description: '阳光明媚，微笑前行',
   *   avatar: 'https://picsum.photos/40/40?random=4',
   *   social: {
   *     bilibili: '@伏案听潮',
   *     qq: 'XXXXXXX',
   *     github: 'https://github.com/yourname',
   *     twitter: 'https://twitter.com/yourname'
   *   }
   * }
   */
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

  /**
   * 广告小部件配置
   * 显示在侧边栏的广告信息
   * 
   * @example
   * ad: {
   *   title: '黑曜石博客',
   *   description: '支持评论弹幕、粒子动画效果、分类',
   *   buttonText: '了解详情',
   *   link: 'https://example.com'
   * }
   */
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

  /**
   * 导航菜单配置
   * 支持多级嵌套菜单结构
   * 
   * @example
   * nav: [
   *   { name: '主页', href: '/', icon: 'icon-[mdi-light--home]' },
   *   {
   *     name: '软件资源',
   *     icon: 'icon-[lucide--database]',
   *     items: [
   *       {
   *         items: [
   *           { text: 'Windows工具', link: '#', icon: 'icon-[lucide--database]' }
   *         ]
   *       }
   *     ]
   *   }
   * ]
   */
  nav: Array<{
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
   * 文章分类配置
   * 定义网站的文章分类
   * 
   * @example
   * categories: [
   *   { name: '支持', title: '支持' },
   *   { name: '帮助', title: '帮助' },
   *   { name: 'tech', title: '技术' },
   *   { name: 'life', title: '生活' }
   * ]
   */
  categories: Array<{
    /** 分类的标识符（用于 URL） */
    name: string;
    /** 分类的显示名称 */
    title: string;
  }>;

  /**
   * 侧边栏组件显示控制
   * 
   * @example
   * sidebar: {
   *   home: {
   *     statsWidget: true,      // 显示网站统计
   *     authorWidget: true,   // 显示作者信息
   *     adWidget: true,        // 显示广告
   *     tag: true,            // 显示标签云
   *     recommendedArticles: true // 显示推荐文章
   *   },
   *   article: {
   *     authorWidget: true,    // 文章页显示作者
   *     tag: true,           // 显示文章标签
   *     toc: true            // 显示文章目录
   *   }
   * }
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

  /**
   * 底部版权信息
   * 
   * @example
   * footer: {
   *   text: '© 2025 风雅中华 - 阳光明媚，微笑前行'
   * }
   */
  footer: {
    /** 底部显示的版权文字 */
    text: string;
  };

  /**
   * 文章加载配置
   * 控制文章列表的加载方式
   * 
   * @example
   * articleLoad: {
   *   type: 'auto',        // 'button' 点击按钮加载更多，'auto' 滚动自动加载
   *   defaultLimit: 20,    // 最多加载多少篇文章
   *   initialLoad: 8,      // 首次加载多少篇
   *   loadMore: 4          // 每次加载多少篇
   * }
   */
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

  /**
   * 搜索配置
   * 
   * @example
   * search: {
   *   provider: 'local'  // 'local' 使用本地搜索，'algolia' 使用 Algolia 搜索
   * }
   */
  search: {
    /** 搜索服务提供商：'local' 本地搜索 或 'algolia' Algolia搜索 */
    provider: 'local' | 'algolia';
  };

  /**
   * 轮播图配置
   * 首页轮播图的标题设置
   * 
   * @example
   * carousel: {
   *   title: '精选文章'
   * }
   */
  carousel: {
    /** 轮播图标题 */
    title: string;
  };

  /**
   * Banner配置
   * 首页头部横幅的配置
   * 
   * @example
   * banner: {
   *   title: "Star read 星阅主题",
   *   backgroundImage: "https://picsum.photos/1200/300",
   *   tags: [
   *     "基于Vite+Tailwindcss",
   *     "支持深色模式", 
   *     "模块化组件"
   *   ]
   * }
   */
  banner: {
    /** Banner标题 */
    title: string;
    /** 背景图片URL */
    backgroundImage: string;
    /** 标签列表 */
    tags: string[];
  };
}