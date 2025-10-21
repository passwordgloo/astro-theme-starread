import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    categories: z.array(z.string()).optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articles,
};

export const themeConfig = {
  // 网站配置
  site: {
    title: '星阅主题',
    favicon: '/favicon.svg',
    logo: {
      image: '/logo.svg',
      darkImage: '/logo-dark.svg',
      text: 'Lovestu',
      alt: 'Lovestu Logo',
    },
  },

  // 作者信息
  author: {
    name: '风雅中华',
    description: '阳光明媚，微笑前行',
    avatar: 'https://picsum.photos/40/40?random=4',
    social: {
      bilibili: '@伏案听潮',
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

  // 导航菜单配置 - 支持嵌套结构
  nav: [
    { name: '主页', href: '/', icon: 'icon-[mdi-light--home]' },
    {
      name: '软件资源',
      icon: 'icon-[lucide--database]',
      items: [
        {
          items: [
            { text: 'Windows工具', link: '#', icon: 'icon-[lucide--database]' },
            { text: 'Mac工具', link: '#', icon: 'icon-[lucide--database]' },
            { text: 'Linux工具', link: '#', icon: 'icon-[lucide--database]' },
            { text: '移动工具', link: '#', icon: 'icon-[lucide--database]' }
          ]
        }
      ]
    },
    {
      name: '教程指南',
      icon: 'icon-[lucide--book]',
      items: [
        {
          text: '开发教程',
          items: [
            { text: '前端开发', link: '#', icon: 'icon-[lucide--code]' },
            { text: '后端开发', link: '#', icon: 'icon-[lucide--server]' }
          ]
        },
        {
          text: '技巧分享',
          items: [
            { text: '效率工具', link: '#', icon: 'icon-[lucide--circle-help]' },
            { text: '实用脚本', link: '#', icon: 'icon-[lucide--code]' }
          ]
        }
      ]
    },
    { name: '代码编程', href: '#', icon: 'icon-[lucide--code]' },
    { name: '汇编逆向', href: '#', icon: 'icon-[lucide--lock]' },
  ],

  // 文章分类配置
  categories: [
    { name: '支持', title: '支持' },
    { name: '帮助', title: '帮助' },
  ],

  // 侧边栏组件显示控制
  sidebar: {
    // 首页侧边栏组件
    home: {
      statsWidget: true,
      authorWidget: true,
      adWidget: true,
      recommendedArticles: true,
    },
    // 文章页侧边栏组件
    article: {
      authorWidget: true,
      // tableOfContents(简称toc) 文章目录
      toc: true,
    },
  },

  // 底部文字配置
  footer: {
    text: '© 2025 风雅中华 - 阳光明媚，微笑前行',
  },
};
