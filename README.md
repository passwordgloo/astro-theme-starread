# Star Read - Astro博客主题

一个现代化的Astro博客主题，支持多种搜索服务。

## 🚀 特性

- 🎨 现代化UI设计
- 🔍 支持本地搜索（Pagefind）和Algolia搜索
- 📱 响应式设计
- 🌙 深色/浅色主题切换
- 🏷️ 标签和分类支持
- 📊 文章统计和作者信息展示

## 🔍 搜索配置

### 本地搜索（默认）
默认使用Pagefind进行本地搜索，无需额外配置。

### Algolia搜索
要使用Algolia搜索服务：

1. 复制 `.env.example` 为 `.env`
2. 在 [Algolia官网](https://www.algolia.com/) 注册账号并创建应用
3. 获取以下信息并填入 `.env`：
   ```
   ALGOLIA_APP_ID=your_app_id
   ALGOLIA_ADMIN_KEY=your_admin_key
   ALGOLIA_SEARCH_KEY=your_search_key
   ALGOLIA_INDEX_NAME=articles
   ```
4. 修改 `src/content/config.ts` 中的搜索配置：
   ```typescript
   search: {
     provider: 'algolia', // 改为 'algolia'
     // ... 其他配置
   }
   ```

构建时会自动生成 `data.json` 并上传到Algolia。

## 🧞 命令

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | 安装依赖                                        |
| `pnpm dev`             | 启动本地开发服务器 `localhost:4321`              |
| `pnpm build`           | 构建生产站点到 `./dist/`                        |
| `pnpm preview`         | 本地预览构建结果                                |

## 🚀 项目结构

```text
/
├── src/
│   ├── components/     # 组件文件
│   ├── content/        # 内容配置
│   ├── layouts/        # 布局模板
│   ├── pages/          # 页面路由
│   └── styles/         # 样式文件
├── public/             # 静态资源
└── dist/               # 构建输出
```
<script define:vars={{ algoliaConfig }}>
  let searchClient = null;
  let searchInstance = null;

  // 加载Algolia搜索
  async function loadAlgoliaSearch() {
    if (searchClient) return;

    console.log('开始加载Algolia搜索...');
    
    if (!algoliaConfig.appId || !algoliaConfig.searchKey) {
      console.warn('Algolia配置不完整，显示默认搜索框');
      // 显示一个基础的搜索框，即使没有Algolia配置
      const container = document.getElementById('algolia-search-container');
      if (container) {
        container.innerHTML = `
          <div class="p-4 text-center text-gray-500">
            <div class="text-sm mb-2">搜索功能需要配置Algolia</div>
            <div class="text-xs">请在.env文件中设置ALGOLIA_APP_ID和ALGOLIA_SEARCH_KEY</div>
          </div>
        `;
      }
      return;
    }

    try {
      // 动态加载Algolia脚本 - 使用正确的CDN URL
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js';
      
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@1/dist/umd/index.production.js';

      // 按顺序加载脚本
      await new Promise((resolve, reject) => {
        script1.onload = () => {
          document.head.appendChild(script2);
          script2.onload = resolve;
          script2.onerror = reject;
        };
        script1.onerror = reject;
        document.head.appendChild(script1);
      });

      // 确保全局变量存在
      if (typeof algoliasearch === 'undefined' || typeof window.autocomplete === 'undefined') {
        throw new Error('Algolia脚本加载失败');
      }

      // 初始化Algolia客户端
      searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.searchKey);
      
      // 初始化Autocomplete
      searchInstance = window.autocomplete({
        container: '#algolia-search-container',
        placeholder: '搜索文章...',
        openOnFocus: true,
        autoFocus: true,
        classNames: {
          detachedSearchButton: 'w-full',
          detachedSearchButtonPlaceholder: 'text-gray-500 dark:text-gray-400',
        },
        getSources({ query }) {
          if (!query) return [];
          
          return [
            {
              sourceId: 'articles',
              getItems() {
                return searchClient
                  .initIndex(algoliaConfig.indexName)
                  .search(query, {
                    hitsPerPage: 8,
                    attributesToHighlight: ['title', 'description'],
                    highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
                    highlightPostTag: '</mark>'
                  })
                  .then(({ hits }) => hits);
              },
              templates: {
                item({ item, html }) {
                  return html`
                    <a href="${item.link}" class="block no-underline">
                      <div class="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                        ${item._highlightResult?.title?.value || item.title}
                      </div>
                      <div class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        ${item._highlightResult?.description?.value || item.description || ''}
                      </div>
                    </a>
                  `;
                },
                noResults({ html }) {
                  return html`
                    <div class="text-center py-4 text-gray-500 dark:text-gray-400">
                      <div class="text-sm">没有找到相关结果</div>
                      <div class="text-xs mt-1">请尝试其他关键词</div>
                    </div>
                  `;
                }
              }
            }
          ];
        }
      });
      
      console.log('Algolia搜索初始化成功');
    } catch (error) {
      console.error('加载Algolia搜索失败:', error);
      // 显示错误信息
      const container = document.getElementById('algolia-search-container');
      if (container) {
        container.innerHTML = `
          <div class="p-4 text-center text-red-500">
            <div class="text-sm mb-2">搜索加载失败</div>
            <div class="text-xs">${error.message}</div>
          </div>
        `;
      }
    }
  }

  // 立即执行搜索初始化
  function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchClose = document.getElementById('search-close');

    if (!searchToggle || !searchDropdown || !searchClose) {
      console.error('搜索元素未找到:', {
        searchToggle: !!searchToggle,
        searchDropdown: !!searchDropdown,
        searchClose: !!searchClose
      });
      return;
    }

    console.log('Algolia搜索元素已找到，开始绑定事件...');

    // 切换搜索框显示/隐藏
    searchToggle.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('搜索按钮被点击');
      
      // 检查下拉框当前状态
      const isHidden = searchDropdown.classList.contains('invisible') || 
                      searchDropdown.classList.contains('opacity-0') ||
                      searchDropdown.style.display === 'none';
      
      if (isHidden) {
        console.log('打开搜索下拉框');
        // 确保下拉框可见
        searchDropdown.style.display = 'block';
        searchDropdown.classList.remove('invisible', 'opacity-0', 'scale-95');
        searchDropdown.classList.add('opacity-100', 'scale-100');
        
        try {
          // 加载Algolia搜索
          await loadAlgoliaSearch();
          
          // 聚焦搜索输入框
          setTimeout(() => {
            const input = searchDropdown.querySelector('.aa-Input, input[type="search"], .aa-DetachedSearchButton');
            if (input) {
              input.focus();
              console.log('搜索输入框已聚焦');
            } else {
              console.warn('未找到搜索输入框');
            }
          }, 300);
        } catch (error) {
          console.error('加载Algolia搜索失败:', error);
        }
      } else {
        console.log('关闭搜索下拉框');
        searchDropdown.classList.add('invisible', 'opacity-0', 'scale-95');
        searchDropdown.classList.remove('opacity-100', 'scale-100');
        
        // 延迟隐藏，让动画完成
        setTimeout(() => {
          searchDropdown.style.display = 'none';
        }, 200);
      }
    });

    // 关闭搜索框
    searchClose.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('关闭按钮被点击');
      searchDropdown.classList.add('invisible', 'opacity-0', 'scale-95');
      searchDropdown.classList.remove('opacity-100', 'scale-100');
      
      // 延迟隐藏，让动画完成
      setTimeout(() => {
        searchDropdown.style.display = 'none';
      }, 200);
    });

    // 点击页面其他地方关闭搜索框
    document.addEventListener('click', (e) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(e.target)) {
        searchDropdown.classList.add('invisible', 'opacity-0', 'scale-95');
        searchDropdown.classList.remove('opacity-100', 'scale-100');
        
        // 延迟隐藏，让动画完成
        setTimeout(() => {
          searchDropdown.style.display = 'none';
        }, 200);
      }
    });

    // ESC键关闭搜索框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchDropdown.classList.contains('invisible')) {
        e.preventDefault();
        searchDropdown.classList.add('invisible', 'opacity-0', 'scale-95');
        searchDropdown.classList.remove('opacity-100', 'scale-100');
        
        // 延迟隐藏，让动画完成
        setTimeout(() => {
          searchDropdown.style.display = 'none';
        }, 200);
      }
    });
  }

  // 确保在DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    // DOM已经加载完成，立即执行
    initSearch();
  }

  // 如果页面通过AJAX加载，也尝试初始化
  setTimeout(initSearch, 100);
</script>