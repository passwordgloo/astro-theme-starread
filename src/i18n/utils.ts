import { themeConfig } from '../../starread.config';

const supportedLangs = themeConfig.i18n?.languages?.map(l => l.code) || ['zh', 'en', 'ja', 'ko', 'ru'];
const defaultLang = themeConfig.i18n?.defaultLang || 'zh';

export function getLangFromUrl(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const firstSegment = path.split('/')[0];
  
  if (supportedLangs.includes(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLang;
}

export function getPathWithoutLang(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const segments = path.split('/');
  
  if (supportedLangs.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  
  return '/' + path;
}

export function switchLangPath(url: string, targetLang: string): string {
  if (targetLang === defaultLang) {
    return getPathWithoutLang(url);
  }
  
  const basePath = getPathWithoutLang(url);
  return `/${targetLang}${basePath}`;
}

export function getCurrentLocale(lang: string) {
  const localeKey = lang === defaultLang ? '/' : `/${lang}/`;
  return themeConfig.locales?.[localeKey] || {};
}

export function useTranslations(lang: string) {
  const locale = getCurrentLocale(lang);
  
  return {
    site: {
      title: locale.site?.title || themeConfig.site.title,
      footer: {
        text: locale.site?.footer?.text || themeConfig.site.footer.text,
      },
    },
    widget: {
      author: {
        name: locale.widget?.author?.name || themeConfig.widget.author.name,
        description: locale.widget?.author?.description || themeConfig.widget.author.description,
      },
      ad: {
        title: locale.widget?.ad?.title || themeConfig.widget.ad.title,
        description: locale.widget?.ad?.description || themeConfig.widget.ad.description,
        buttonText: locale.widget?.ad?.buttonText || themeConfig.widget.ad.buttonText,
      },
      categories: locale.widget?.categories || themeConfig.widget.categories,
      carousel: {
        title: locale.widget?.carousel?.title || themeConfig.widget.carousel.title,
      },
      banner: {
        title: locale.widget?.banner?.title || themeConfig.widget.banner.title,
        tags: locale.widget?.banner?.tags || themeConfig.widget.banner.tags,
      },
    },
    navbar: locale.navbar || themeConfig.navbar,
    sidebar: {
      progress: locale.sidebar?.progress || '字数统计',
      author: locale.sidebar?.author || '作者',
      ad: locale.sidebar?.ad || '广告',
      tagcloud: locale.sidebar?.tagcloud || '标签云',
      statistic: locale.sidebar?.statistic || '站点统计',
      toc: locale.sidebar?.toc || '文章目录',
    },
    search: {
      placeholder: locale.search?.placeholder || '搜索文档 (⌘K)',
      noResults: locale.search?.noResults || '没有找到与 "{query}" 相关的内容，请尝试其他关键词',
      loading: locale.search?.loading || '正在搜索...',
      initialTip: locale.search?.initialTip || '支持使用键盘进行导航，Windows用户请用Ctrl 替换 ⌘',
      clear: locale.search?.clear || '清除搜索',
      viewDetails: locale.search?.viewDetails || '查看详情',
      shortcuts: {
        open: locale.search?.shortcuts?.open || '打开搜索',
        browse: locale.search?.shortcuts?.browse || '浏览',
        select: locale.search?.shortcuts?.select || '选择',
        close: locale.search?.shortcuts?.close || '关闭',
      },
    },
    selectText: locale.selectText || '选择语言',
    label: locale.label || '简体中文',
  };
}
