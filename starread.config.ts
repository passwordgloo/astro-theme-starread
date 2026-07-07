/**
 * Starread Theme Configuration
 * 
 * 星阅主题配置文件
 * 
 */
import type { StarreadThemeConfig } from './scripts/type/config';

export const themeConfig: StarreadThemeConfig = {
  /**
   * ====================
   * Global Settings
   * 全局配置
   * ====================
   */

  /**
   * Default language code
   * 
   * 默认语言代码
   * 
   * @default 'zh'
   */
  lang: 'zh',

  /** Site favicon URL / 站点图标 URL */
  favicon: '/favicon.png',

  /** Default cover image URL / 默认封面图片 URL */
  defaultCover: '/defaultCover.jpg',

  /** Site founded date (for statistics) / 站点建立日期 */
  foundedDate: '2025-10-01',

  /** Login page URL / 登录页面 URL */
  loginUrl: '/config',

  /**
   * Logo configuration
   * Logo 配置
   */
  logo: {
    image: '/logo.svg',
    darkImage: '/logo-dark.svg',
    text: '星阅主题',
    alt: '星阅主题 Logo',
  },

  /**
   * Hero section configuration
   * 
   * Hero 区域配置
   */
  hero: {
    enabled: true,
    backgroundImage: '/cover/2f0bcf8fe63c00af.avif',
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

  /**
   * ====================
   * Navigation Bar Configuration
   * 导航栏配置
   * ====================
   */

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
            { text: '移动工具', link: '#', icon: 'Database' },
          ],
        },
      ],
    },
    {
      name: '教程指南',
      icon: 'Book',
      items: [
        {
          text: '开发教程',
          items: [
            { text: '前端开发', link: '#', icon: 'Code' },
            { text: '后端开发', link: '#', icon: 'Server' },
          ],
        },
        {
          text: '技巧分享',
          items: [
            { text: '效率工具', link: '#', icon: 'HelpCircle' },
            { text: '实用脚本', link: '#', icon: 'Code' },
          ],
        },
      ],
    },
    { name: '代码编程', href: '#', icon: 'Code' },
    { name: '汇编逆向', href: '#', icon: 'Lock' },
  ],

  /**
   * ====================
   * Sidebar Configuration
   * 侧边栏配置
   * ====================
   */

  sidebar: {
    home: {
      progress: true,
      statsWidget: true,
      authorWidget: true,
      adWidget: true,
      tag: true,
      recommendedArticles: true,
      statistic: true,
    },
    article: {
      authorWidget: true,
      tag: true,
      toc: true,
    },
  },

  /**
   * ====================
   * Widget Configurations
   * 小部件配置
   * ====================
   */

  widget: {
    /** Latest article widget configuration / 最新文章组件配置 */
    LatestArticle: {
      type: 'button',
      layout: 'horizontal',
      defaultLimit: 20,
      initialLoad: 4,
      loadMore: 4,
      columns: 2,
      defaultAspectRatio: '16:9',
      horizontalHeight: '160px',
    },

    /** Author widget configuration / 作者信息配置 */
    author: {
      avatar: 'https://picsum.photos/40/40?random=4',
      social: {
        bilibili: 'XXXXXX',
        qq: 'XXXXXXX',
      },
    },

    /** Ad widget configuration / 广告配置 */
    ad: {
      link: 'https://example.com',
    },

    /** Categories configuration / 分类配置 */
    categories: [
      { name: '主题介绍' },
      { name: '帮助文档' },
    ],

    /** Carousel configuration / 轮播图配置 */
    carousel: {
      layout: 'vertical',
    },

    /** Banner configuration / 横幅配置 */
    banner: {
      backgroundImage: 'https://picsum.photos/1200/300',
    },
  },

  /**
   * ====================
   * Dynamic Effects
   * 动态效果
   * ====================
   */

  dynamicEffect: {
    postTopWave: true,
  },

  /**
   * ====================
   * Multi-language Configurations
   * 多语言配置
   * ====================
   */

  locales: {
    '/': {
      lang: 'zh-CN',
      title: '星阅主题',
      description: '基于 Astro 的现代化博客主题',
      footer: {
        text: '© 2025 风雅中华 - 阳光明媚，微笑前行',
      },
    },
    '/en/': {
      lang: 'en-US',
      title: 'StarRead Theme',
      description: 'Modern blog theme based on Astro',
      footer: {
        text: '© 2025 StarRead - Keep smiling and moving forward',
      },
    },
    '/ja/': {
      lang: 'ja-JP',
      title: 'スターリードテーマ',
      description: 'Astro ベースのモダンなブログテーマ',
      footer: {
        text: '© 2025 スターリード - 前進し続ける',
      },
    },
    '/ko/': {
      lang: 'ko-KR',
      title: 'StarRead 테마',
      description: 'Astro 기반의 현대적인 블로그 테마',
      footer: {
        text: '© 2025 StarRead - 계속 나아가기',
      },
    },
    '/ru/': {
      lang: 'ru-RU',
      title: 'Тема StarRead',
      description: 'Современная тема для блога на базе Astro',
      footer: {
        text: '© 2025 StarRead - Продолжайте двигаться вперед',
      },
    },
  },

  /**
   * Theme-level locales configuration
   * 
   * 主题级语言环境配置
   * 
   * Key format: '/' for default language, '/en/' for English, etc.
   * Contains language-specific UI texts for widgets, sidebar, search, etc.
   */
  themeLocales: {
    '/': {
      selectLanguageName: '简体中文',
      flag: '🇨🇳',
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
                { text: '移动工具', link: '#', icon: 'Database' },
              ],
            },
          ],
        },
        {
          name: '教程指南',
          icon: 'Book',
          items: [
            {
              text: '开发教程',
              items: [
                { text: '前端开发', link: '#', icon: 'Code' },
                { text: '后端开发', link: '#', icon: 'Server' },
              ],
            },
            {
              text: '技巧分享',
              items: [
                { text: '效率工具', link: '#', icon: 'HelpCircle' },
                { text: '实用脚本', link: '#', icon: 'Code' },
              ],
            },
          ],
        },
        { name: '代码编程', href: '#', icon: 'Code' },
        { name: '汇编逆向', href: '#', icon: 'Lock' },
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
      selectLanguageName: 'English',
      flag: '🇺🇸',
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
        { name: 'Home', href: '/en/', icon: 'Home' },
        {
          name: 'Software',
          icon: 'Database',
          items: [
            {
              items: [
                { text: 'Windows Tools', link: '#', icon: 'Database' },
                { text: 'Mac Tools', link: '#', icon: 'Database' },
                { text: 'Linux Tools', link: '#', icon: 'Database' },
                { text: 'Mobile Tools', link: '#', icon: 'Database' },
              ],
            },
          ],
        },
        {
          name: 'Tutorials',
          icon: 'Book',
          items: [
            {
              text: 'Development',
              items: [
                { text: 'Frontend', link: '#', icon: 'Code' },
                { text: 'Backend', link: '#', icon: 'Server' },
              ],
            },
            {
              text: 'Tips',
              items: [
                { text: 'Productivity', link: '#', icon: 'HelpCircle' },
                { text: 'Scripts', link: '#', icon: 'Code' },
              ],
            },
          ],
        },
        { name: 'Coding', href: '#', icon: 'Code' },
        { name: 'Reverse', href: '#', icon: 'Lock' },
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
      selectLanguageName: '日本語',
      flag: '🇯🇵',
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
      selectLanguageName: '한국어',
      flag: '🇰🇷',
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
      selectLanguageName: 'Русский',
      flag: '🇷🇺',
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
};