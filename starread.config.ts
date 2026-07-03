import type { StarreadThemeConfig } from './scripts/type/config';

export const themeConfig: StarreadThemeConfig = {

  // Hero 区域配置
  hero: {
    enabled: true,
    backgroundImage: '/cover/eRq5UHTwBSmoSguZBTPjB.jpg',
    title: {
      mode: 'jinrishici',
      content: 'Starread',
    },
    effect: {
      gradient: {
        enabled: true,
        colors: ['#2563eb', '#9333ea', '#ec4899'],
      },
      typing: {
        enabled: true,
        repeat: true,
        cursor: true,
        cursorStyle: 'line',
      },
      particles: {
        enabled: true,
      },
    },
  },

  // 网站配置
  site: {
    title: '星阅主题',
    favicon: '/favicon.png',
    defaultCover: '/defaultCover.jpg',
    foundedDate: '2025-10-01',
    loginUrl: '/config',  // 登录按钮跳转链接，指向配置生成页面

    logo: {
      image: '/logo.svg',
      darkImage: '/logo-dark.svg',
      text: '星阅主题',
      alt: '星阅主题 Logo',
    },
    
    // 最新文章组件配置
    LatestArticle: {
      type: 'button', // 'button' 或 'auto'
      layout: 'horizontal', // 'horizontal' 或 'vertical'
      defaultLimit: 20, // 默认最大加载数量
      initialLoad: 4, // 初始加载数量
      loadMore: 4, // 每次加载数量
      columns: 2, // 分栏数，默认2
      defaultAspectRatio: '16:9', // 默认宽高比，支持的比例：16:9, 4:3, 3:2
      horizontalHeight: '160px' // 横版封面高度限制
    },
    
    // 底部文字配置
    footer: {
      text: '© 2025 风雅中华 - 阳光明媚，微笑前行',
    }
  },

  // 语言配置
  // zh: 一周从周一开始
  // en: 一周从周日开始
  language: 'zh',

  // 多语言(i18n)配置
  i18n: {
    enabled: true,
    defaultLang: 'zh',
    languages: [
      { code: 'zh', name: '简体中文', flag: '🇨🇳' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ],
  },

  // 站点多语言配置（类似 VuePress 的 locales）
  locales: {
    '/': {
      label: '简体中文',
      selectText: '选择语言',
      site: {
        title: '星阅主题',
        footer: {
          text: '© 2025 风雅中华 - 阳光明媚，微笑前行',
        },
      },
      widget: {
        author: {
          name: '风雅中华',
          description: '阳光明媚，微笑前行',
        },
        ad: {
          title: '黑曜石博客',
          description: '支持评论弹幕、粒子动画效果、分类',
          buttonText: '了解详情',
        },
        categories: [
          { name: '主题说明', title: '主题说明' },
          { name: '帮助', title: '帮助' },
        ],
        carousel: {
          title: '轮播',
        },
        banner: {
          title: 'Star read 星阅主题',
          tags: ['基于Vite+Tailwindcss', '支持深色模式', '模块化组件'],
        },
      },
      navbar: [
        { name: '主页' },
        { name: '软件资源' },
        { name: '教程指南' },
        { name: '代码编程' },
        { name: '汇编逆向' },
      ],
      sidebar: {
        progress: '字数统计',
        author: '作者',
        ad: '广告',
        tagcloud: '标签云',
        statistic: '站点统计',
        toc: '文章目录',
      },
      search: {
        placeholder: '搜索文档 (⌘K)',
        noResults: '没有找到与 "{query}" 相关的内容，请尝试其他关键词',
        loading: '正在搜索...',
        initialTip: '支持使用键盘进行导航，Windows用户请用Ctrl 替换 ⌘',
        clear: '清除搜索',
        viewDetails: '查看详情',
        shortcuts: {
          open: '打开搜索',
          browse: '浏览',
          select: '选择',
          close: '关闭',
        },
      },
    },
    '/en/': {
      label: 'English',
      selectText: 'Select Language',
      site: {
        title: 'StarRead Theme',
        footer: {
          text: '© 2025 StarRead - Keep smiling and moving forward',
        },
      },
      widget: {
        author: {
          name: 'StarRead',
          description: 'Keep smiling and moving forward',
        },
        ad: {
          title: 'Obsidian Blog',
          description: 'Supports comments, particle effects, categories',
          buttonText: 'Learn More',
        },
        categories: [
          { name: 'Theme Guide', title: 'Theme Guide' },
          { name: 'Help', title: 'Help' },
        ],
        carousel: {
          title: 'Carousel',
        },
        banner: {
          title: 'StarRead Theme',
          tags: ['Based on Vite+Tailwindcss', 'Dark Mode Support', 'Modular Components'],
        },
      },
      navbar: [
        { name: 'Home' },
        { name: 'Software' },
        { name: 'Tutorials' },
        { name: 'Coding' },
        { name: 'Reverse' },
      ],
      sidebar: {
        progress: 'Word Count',
        author: 'Author',
        ad: 'Advertisement',
        tagcloud: 'Tag Cloud',
        statistic: 'Statistics',
        toc: 'Table of Contents',
      },
      search: {
        placeholder: 'Search docs (⌘K)',
        noResults: 'No results found for "{query}", try other keywords',
        loading: 'Searching...',
        initialTip: 'Keyboard navigation supported. Windows users use Ctrl instead of ⌘',
        clear: 'Clear Search',
        viewDetails: 'View Details',
        shortcuts: {
          open: 'Open Search',
          browse: 'Browse',
          select: 'Select',
          close: 'Close',
        },
      },
    },
    '/ja/': {
      label: '日本語',
      selectText: '言語を選択',
      site: {
        title: 'スターリードテーマ',
        footer: {
          text: '© 2025 スターリード - 前進し続ける',
        },
      },
      widget: {
        author: {
          name: 'スターリード',
          description: '前進し続ける',
        },
        ad: {
          title: 'オブシディアンブログ',
          description: 'コメント、パーティクル効果、カテゴリに対応',
          buttonText: '詳細を見る',
        },
      },
      sidebar: {
        progress: '文字数',
        author: '作者',
        ad: '広告',
        tagcloud: 'タグクラウド',
        statistic: '統計',
        toc: '目次',
      },
      search: {
        placeholder: 'ドキュメントを検索 (⌘K)',
        noResults: '"{query}" に関する結果が見つかりません。他のキーワードを試してください',
        loading: '検索中...',
        initialTip: 'キーボード操作が可能です。Windowsユーザーは ⌘ の代わりに Ctrl を使用してください',
        clear: '検索をクリア',
        viewDetails: '詳細を見る',
        shortcuts: {
          open: '検索を開く',
          browse: '閲覧',
          select: '選択',
          close: '閉じる',
        },
      },
    },
    '/ko/': {
      label: '한국어',
      selectText: '언어 선택',
      site: {
        title: 'StarRead 테마',
        footer: {
          text: '© 2025 StarRead - 계속 나아가기',
        },
      },
      sidebar: {
        progress: '단어 수',
        author: '저자',
        ad: '광고',
        tagcloud: '태그 클라우드',
        statistic: '통계',
        toc: '목차',
      },
      search: {
        placeholder: '문서 검색 (⌘K)',
        noResults: '"{query}"와 관련된 결과를 찾을 수 없습니다. 다른 키워드를 시도하세요',
        loading: '검색 중...',
        initialTip: '키보드 탐색을 지원합니다. Windows 사용자는 ⌘ 대신 Ctrl을 사용하세요',
        clear: '검색 지우기',
        viewDetails: '자세히 보기',
        shortcuts: {
          open: '검색 열기',
          browse: '탐색',
          select: '선택',
          close: '닫기',
        },
      },
    },
    '/ru/': {
      label: 'Русский',
      selectText: 'Выберите язык',
      site: {
        title: 'Тема StarRead',
        footer: {
          text: '© 2025 StarRead - Продолжайте двигаться вперед',
        },
      },
      sidebar: {
        progress: 'Количество слов',
        author: 'Автор',
        ad: 'Реклама',
        tagcloud: 'Облако тегов',
        statistic: 'Статистика',
        toc: 'Оглавление',
      },
      search: {
        placeholder: 'Поиск документов (⌘K)',
        noResults: 'Ничего не найдено по запросу "{query}", попробуйте другие ключевые слова',
        loading: 'Идет поиск...',
        initialTip: 'Поддерживается навигация с клавиатуры. Пользователи Windows используйте Ctrl вместо ⌘',
        clear: 'Очистить поиск',
        viewDetails: 'Подробнее',
        shortcuts: {
          open: 'Открыть поиск',
          browse: 'Обзор',
          select: 'Выбрать',
          close: 'Закрыть',
        },
      },
    },
  },

  // 动态效果配置
  dynamicEffect: {
    postTopWave: true
  },

  // 小部件配置
  widget: {
    // Banner配置
    banner: {
      title: "Star read 星阅主题",
      backgroundImage: "https://picsum.photos/1200/300",
      tags: [
        "基于Vite+Tailwindcss",
        "支持深色模式",
        "模块化组件"
      ]
    },
    
    // 轮播图配置
    carousel: {
      title: "轮播",
      layout: "vertical" // 'horizontal' 或 'vertical'
    },
    
    // 作者信息
    author: {
      name: '风雅中华',
      description: '阳光明媚，微笑前行',
      avatar: 'https://picsum.photos/40/40?random=4',
      social: {
        bilibili: 'XXXXXX',
        qq: 'XXXXXXX',
      },
    },
    
    // 广告配置
    ad: {
      title: '黑曜石博客',
      description: '支持评论弹幕、粒子动画效果、分类',
      buttonText: '了解详情',
      link: 'https://example.com',
    },
    
    // 文章分类配置
    categories: [
      { name: '主题介绍', title: '主题介绍' },
      { name: '帮助文档', title: '帮助文档' },
    ]
  },

  // 导航菜单配置，图标名称对应 @lucide/astro 的组件名
  navbar: [
    { name: '主页', href: '/', icon: 'Home' },
    {
      name: '软件资源',
      icon: 'Database',
      items: [
        {
          items: [
            { text: 'Windows工具', link: '#', icon: 'Database' },
            { text: 'Mac工具', link: '#', icon: 'Database' },
            { text: 'Linux工具', link: '#', icon: 'Database' },
            { text: '移动工具', link: '#', icon: 'Database' }
          ]
        }
      ]
    },
    {
      name: '教程指南',
      icon: 'Book',
      items: [
        {
          text: '开发教程',
          items: [
            { text: '前端开发', link: '#', icon: 'Code' },
            { text: '后端开发', link: '#', icon: 'Server' }
          ]
        },
        {
          text: '技巧分享',
          items: [
            { text: '效率工具', link: '#', icon: 'HelpCircle' },
            { text: '实用脚本', link: '#', icon: 'Code' }
          ]
        }
      ]
    },
    { name: '代码编程', href: '#', icon: 'Code' },
    { name: '汇编逆向', href: '#', icon: 'Lock' },
  ],

  // 侧边栏组件显示控制 - 保持不变
  sidebar: {
    // 首页侧边栏组件
    home: {
      progress: true,
      statsWidget: true,
      authorWidget: true,
      adWidget: true,
      tag: true,
      recommendedArticles: true,
      statistic: true, // 站点统计组件
    },
    // 文章页侧边栏组件
    article: {
      authorWidget: true,
      tag: true,
      // tableOfContents(简称toc) 文章目
      toc: true
    },
  },
};
