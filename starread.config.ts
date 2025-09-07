import { StarReadThemeConfig } from 'astro-theme-starread/config';

export default StarReadThemeConfig({
  carousel: {
    title: "轮播"
  },
  site: {
    title: '星阅主题',
    favicon: '/favicon.svg',
    defaultCover: '/defaultCover.jpg',
    logo: {
      image: '/logo.svg',
      darkImage: '/logo-dark.svg',
      text: 'Lovestu',
      alt: 'Lovestu Logo'
    }
  },
  author: {
    name: '风雅中华',
    description: '阳光明媚，微笑前行',
    avatar: 'https://picsum.photos/40/40?random=4',
    social: {
      bilibili: '@伏案听潮',
      qq: 'XXXXXXX'
    }
  },
  ad: {
    title: '黑曜石博客',
    description: '支持评论弹幕、粒子动画效果、分类',
    buttonText: '了解详情',
    link: 'https://example.com'
  },
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
  categories: [
    { name: '支持', title: '支持' },
    { name: '帮助', title: '帮助' }
  ],
  sidebar: {
    home: { statsWidget: true, authorWidget: true, adWidget: true, tag: true, recommendedArticles: true },
    article: { authorWidget: true, tag: true, toc: true }
  },
  footer: { text: '© 2025 风雅中华 - 阳光明媚，微笑前行' },
  articleLoad: { type: 'auto', defaultLimit: 20, initialLoad: 8, loadMore: 4 },
  search: { provider: 'local' }
});
