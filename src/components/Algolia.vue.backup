<template>
  <div class="docsearch-container">
    <!-- 搜索按钮触发器 -->
    <button 
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      @click="toggleSearch"
      aria-label="搜索"
    >
      <span class="icon-[lucide--search] h-5 w-5 text-gray-700 dark:text-gray-300"></span>
    </button>

    <!-- 搜索弹窗 - 参考VuePress docsearch插件风格 -->
    <Transition name="docsearch">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50 backdrop-blur-sm" 
        @click.self="closeSearch"
      >
        <div 
          class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- 搜索头部 - 符合VuePress风格 -->
          <div class="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <div class="relative w-full">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span class="icon-[lucide--search] h-5 w-5"></span>
              </span>
              <input
                v-model="searchQuery"
                ref="searchInput"
                type="text"
                placeholder="搜索文档 (⌘K)"
                class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-0 rounded-md text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 outline-none"
                @input="handleSearch"
                @keydown.esc="closeSearch"
                @keydown.arrow-down="focusNextResult"
                @keydown.arrow-up="focusPrevResult"
                @keydown.enter="selectCurrentResult"
                @keydown="handleKeyDown"
              />
            </div>
            <button 
              class="ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="closeSearch"
              aria-label="关闭"
            >
              <span class="icon-[lucide--x] h-5 w-5"></span>
            </button>
          </div>

          <!-- 搜索结果 - 使用vue-instantsearch风格 -->
          <div class="flex-1 overflow-y-auto max-h-[60vh]">
            <div v-if="isInitialState" class="search-initial-state">
              <div class="text-center py-12">
                <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span class="icon-[lucide--search] h-8 w-8 text-blue-600 dark:text-blue-400"></span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">搜索文档</h3>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  输入关键词搜索文档内容，支持使用键盘进行导航
                </p>
                <div class="mt-6 flex justify-center space-x-3">
                  <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 text-xs">⌘K</kbd>
                  <span class="text-gray-500 dark:text-gray-400 text-sm">打开搜索</span>
                </div>
              </div>
            </div>

            <div v-else-if="isSearching" class="search-loading-state">
              <div class="text-center py-10">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 mb-4"></div>
                <p class="text-gray-500 dark:text-gray-400">正在搜索...</p>
              </div>
            </div>

            <div v-else-if="hasResults" class="search-results-state">
              <div class="search-results-header border-b dark:border-gray-800 px-4 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>找到 {{ searchResults.length }} 个结果</span>
                <span class="text-xs">{{ searchQuery }}<span class="font-medium ml-1"></span></span>
              </div>
              <div class="p-2 space-y-1">
                <div
                  v-for="(hit, index) in searchResults"
                  :key="hit.objectID || hit.id || index"
                  class="flex items-start p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  :class="{ 'bg-blue-50 dark:bg-blue-900/20': index === currentResultIndex }"
                  @mouseenter="setCurrentIndex(index)"
                  @click="selectResult(hit)"
                >
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {{ hit.title || '未命名文档' }}
                    </h3>
                    <p v-if="hit.content" class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ highlightText(hit.content, searchQuery) }}
                    </p>
                    <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <span v-if="hit.categories" class="mr-3">
                        📂 {{ formatCategories(hit.categories) }}
                      </span>
                      <div v-if="hit.tags" class="flex flex-wrap gap-1">
                        <span
                          v-for="(tag, tagIndex) in formatTags(hit.tags)"
                          :key="tagIndex"
                          class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="searchQuery.trim()" class="search-no-results">
              <div class="text-center py-12 px-4">
                <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <span class="icon-[lucide--circle-help] h-8 w-8 text-gray-500 dark:text-gray-400"></span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到结果</h3>
                <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  没有找到与 "<span class="font-medium">{{ searchQuery }}</span>" 相关的内容，请尝试其他关键词
                </p>
                <div class="mt-4">
                  <button 
                    @click="clearSearch"
                    class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    清除搜索
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部提示 - 参考VuePress样式 -->
          <div class="p-3 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div class="flex items-center gap-1">
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">⌘K</kbd>
                <span>打开搜索</span>
              </div>
              <div class="flex items-center gap-1">
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">↓</kbd>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">↑</kbd>
                <span>浏览结果</span>
              </div>
              <div class="flex items-center gap-1">
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">Enter</kbd>
                <span>选择</span>
              </div>
              <div class="flex items-center gap-1">
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">Esc</kbd>
                <span>关闭</span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <span>由</span> 
              <span class="text-blue-500 font-medium">Algolia</span>
              <span>提供支持</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import * as algoliasearch from 'algoliasearch/lite';
import { useLocalStorage } from '@vueuse/core';

// 定义文章Hit类型
interface ArticleHit {
  objectID?: string;
  id?: string;
  title: string;
  content?: string;
  slug: string;
  cover?: string;
  tags?: string[] | string;
  categories?: string[] | string;
  permalink?: string;
  collection?: string;
  url?: string;
  route?: string;
  _collection?: string;
  [key: string]: any;
}

// 搜索相关状态
const isOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<ArticleHit[]>([]);
const isSearching = ref(false);
const currentResultIndex = ref(-1);
const searchInput = ref<HTMLInputElement>();

// 使用localStorage存储搜索历史
const searchHistory = useLocalStorage<string[]>('docsearch-history', []);
const MAX_HISTORY_ITEMS = 5;

// 计算属性
const hasResults = computed(() => searchResults.value.length > 0);
const isInitialState = computed(() => !searchQuery.value.trim() && !isSearching.value);

// 模拟Algolia客户端配置
const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID || 'YOUR_ALGOLIA_APP_ID',
  apiKey: process.env.ALGOLIA_API_KEY || 'YOUR_ALGOLIA_SEARCH_KEY',
  indexName: process.env.ALGOLIA_INDEX_NAME || 'docs'
};

// 初始化Algolia客户端
let searchClient: ReturnType<typeof algoliasearch> | null = null;
let searchIndex: any = null;

try {
  if (algoliaConfig.appId !== 'YOUR_ALGOLIA_APP_ID' && algoliaConfig.apiKey !== 'YOUR_ALGOLIA_SEARCH_KEY') {
    searchClient = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
    searchIndex = searchClient.initIndex(algoliaConfig.indexName);
  }
} catch (error) {
  console.warn('Algolia初始化失败，将使用模拟数据:', error);
}

// 切换搜索弹窗
const toggleSearch = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  } else {
    resetSearch();
  }
};

// 关闭搜索
const closeSearch = () => {
  isOpen.value = false;
  resetSearch();
};

// 重置搜索状态
const resetSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  currentResultIndex.value = -1;
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  currentResultIndex.value = -1;
  searchInput.value?.focus();
};

// 搜索处理函数 - 参考vue-instantsearch风格
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    currentResultIndex.value = -1;
    return;
  }

  isSearching.value = true;
  currentResultIndex.value = -1;
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 尝试使用Algolia客户端搜索
    if (searchIndex) {
      const { hits } = await searchIndex.search(searchQuery.value, {
        hitsPerPage: 10,
        attributesToRetrieve: ['title', 'content', 'slug', 'categories', 'tags', 'permalink', 'collection']
      });
      searchResults.value = hits;
    } else {
      // 使用模拟数据 - 在实际项目中应该使用真实的搜索数据
      // 这里从本地data.json获取数据进行模拟搜索
      try {
        const response = await fetch('/data.json');
        const allDocs = await response.json();
        
        // 简单的搜索过滤
        searchResults.value = allDocs.filter((doc: ArticleHit) => 
          (doc.title && doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
          (doc.content && doc.content.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
          (doc.tags && String(doc.tags).toLowerCase().includes(searchQuery.value.toLowerCase()))
        );
      } catch (err) {
        console.error('获取模拟数据失败:', err);
        searchResults.value = [];
      }
    }
  } catch (error) {
    console.error('搜索失败:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// 聚焦下一个结果
const focusNextResult = (e: KeyboardEvent) => {
  e.preventDefault();
  if (searchResults.value.length === 0) return;
  
  if (currentResultIndex.value < searchResults.value.length - 1) {
    currentResultIndex.value++;
  } else {
    currentResultIndex.value = 0;
  }
  
  // 滚动到当前高亮结果
  scrollToActiveResult();
};

// 聚焦上一个结果
const focusPrevResult = (e: KeyboardEvent) => {
  e.preventDefault();
  if (searchResults.value.length === 0) return;
  
  if (currentResultIndex.value > 0) {
    currentResultIndex.value--;
  } else {
    currentResultIndex.value = searchResults.value.length - 1;
  }
  
  // 滚动到当前高亮结果
  scrollToActiveResult();
};

// 滚动到当前激活的结果
const scrollToActiveResult = () => {
  setTimeout(() => {
    const activeElement = document.querySelector('.search-results-state .bg-blue-50, .search-results-state .bg-blue-900\/20');
    if (activeElement) {
      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, 50);
};

// 选择当前结果
const selectCurrentResult = () => {
  if (currentResultIndex.value >= 0 && currentResultIndex.value < searchResults.value.length) {
    selectResult(searchResults.value[currentResultIndex.value]);
  }
};

// 选择指定结果
const selectResult = (hit: ArticleHit) => {
  // 添加到搜索历史
  addToSearchHistory(hit.title);
  
  // 构建链接并跳转
  const collection = hit.collection || hit._collection || 'articles';
  let url = '';
  
  if (hit.permalink) {
    url = hit.permalink.startsWith('/') ? hit.permalink : `/${hit.permalink}`;
  } else if (hit.route) {
    url = hit.route;
  } else if (hit.url) {
    url = hit.url;
  } else {
    url = `/${collection}/${hit.slug}`;
  }
  
  window.location.href = url;
};

// 添加到搜索历史
const addToSearchHistory = (term: string) => {
  const history = [...searchHistory.value];
  // 移除重复项
  const filteredHistory = history.filter(item => item !== term);
  // 添加到开头
  filteredHistory.unshift(term);
  // 限制历史记录数量
  searchHistory.value = filteredHistory.slice(0, MAX_HISTORY_ITEMS);
};

// 文本高亮处理
const highlightText = (text: string, query: string): string => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.split(regex)
    .map((part, index) => 
      regex.test(part) 
        ? `<mark class="bg-yellow-200 dark:bg-yellow-900/40 px-0.5 rounded">${part}</mark>`
        : part
    )
    .join('');
};

// 转义正则表达式特殊字符
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 格式化分类
const formatCategories = (categories: string | string[]): string => {
  if (!categories) return '';
  return Array.isArray(categories) ? categories.join(' / ') : categories;
};

// 格式化标签
const formatTags = (tags: string | string[]): string[] => {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
};

// 设置当前索引
const setCurrentIndex = (index: number) => {
  currentResultIndex.value = index;
};

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  // 处理其他特殊按键
  if (e.key === 'Tab') {
    e.preventDefault();
    focusNextResult(e);
  }
};

// 全局键盘快捷键处理
const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K 打开搜索
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleSearch();
  }
  
  // 全局ESC键关闭
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault();
    closeSearch();
  }
};

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    // 重置结果索引
    currentResultIndex.value = -1;
  }
});

// 生命周期钩子
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style scoped>
/* 搜索弹窗过渡动画 - 参考VuePress风格 */
.docsearch-enter-active,
.docsearch-leave-active {
  transition: opacity 0.2s ease;
}

.docsearch-enter-from,
.docsearch-leave-to {
  opacity: 0;
}

/* 搜索结果容器样式 */
.search-results-state {
  max-height: calc(60vh - 6rem);
}

/* 高亮文本样式 */
:deep(mark) {
  background-color: #fef3c7;
  color: inherit;
  border-radius: 0.125rem;
  padding: 0 0.25rem;
}

:deep(.dark mark) {
  background-color: rgba(234, 179, 8, 0.2);
  color: inherit;
}

/* 键盘快捷键样式 - 符合VuePress风格 */
kbd {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.25;
  padding: 0.125rem 0.375rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  color: #1f2937;
}

.dark kbd {
  background-color: #374151;
  border-color: #4b5563;
  color: #d1d5db;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.2);
}

/* 滚动条样式优化 */
.search-results-state::-webkit-scrollbar,
.search-no-results::-webkit-scrollbar,
.search-initial-state::-webkit-scrollbar {
  width: 6px;
}

.search-results-state::-webkit-scrollbar-track,
.search-no-results::-webkit-scrollbar-track,
.search-initial-state::-webkit-scrollbar-track {
  background: transparent;
}

.search-results-state::-webkit-scrollbar-thumb,
.search-no-results::-webkit-scrollbar-thumb,
.search-initial-state::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.dark .search-results-state::-webkit-scrollbar-thumb,
.dark .search-no-results::-webkit-scrollbar-thumb,
.dark .search-initial-state::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>