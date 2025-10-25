import type { starreadthemeconfig } from './scripts/config';

export const themeConfig: starreadthemeconfig = {

  // 网站配置
  site: {
    title: '星阅主题',
    favicon: '/favicon.png',
    defaultCover: '/defaultCover.jpg',
    foundedDate: '2025-10-01',
    
    logo: {
      image: '/logo.svg',
      darkImage: '/logo-dark.svg',
      text: '星阅主题',
      alt: '星阅主题 Logo',
    },
    
    // 文章相关配置
    article: {
      // 文章加载配置
      articleLoad: {
        type: 'button', // 'button' 或 'auto'
        defaultLimit: 20, // 默认最大加载数量
        initialLoad: 8, // 初始加载数量
        loadMore: 4 // 每次加载数量
      },
      
      // 封面图片配置
      coverImage: {
        defaultAspectRatio: '16:9' // 默认宽高比，支持的比例：16:9, 4:3, 3:2
      }
    },
    
    // 底部文字配置
    footer: {
      text: '© 2025 风雅中华 - 阳光明媚，微笑前行',
    }
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
      title: "轮播"
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
      { name: '主题说明', title: '主题说明' },
      { name: '帮助', title: '帮助' },
    ]
  },

  // 导航菜单配置（重命名为navbar）- 支持嵌套结构，修改图标集合名请一定要在global.css中添加
  navbar: [
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

  // 侧边栏组件显示控制 - 保持不变
  sidebar: {
    // 首页侧边栏组件
    home: {
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
