<template>
  <div 
    id="article-toc-container" 
    ref="tocRef"
    :class="[
      'bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_8px_30px_rgba(0,0,0,0.06)]',
      'dark:bg-cyan-950/30 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_30px_rgba(0,0,0,0.35)]',
      'rounded-lg shadow-sm p-4 transition-all duration-300',
      isSticky && 'sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto'
    ]"
  >
    <div class="flex items-center space-x-2 mb-4">
      <span class="icon-[lucide--list-tree] w-5 h-5 text-accent"></span>
      <span class="text-accent font-bold text-lg">文章目录</span>
    </div>
    
    <template v-if="!hasHeadings">
      <div class="text-center py-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 mb-3">
          <span class="icon-[lucide--list-tree] w-5 h-5 transition-colors duration-300"></span>
        </div>
        <p class="text-gray-500 dark:text-slate-400 italic">暂无目录</p>
      </div>
    </template>
    
    <template v-else>
      <nav id="table-of-contents" class="text-sm space-y-1 scroll-smooth">
        <div 
          v-for="(heading, index) in headings" 
          :key="heading.id" 
          class="relative"
        >
          <a 
            :href="`#${heading.id}`" 
            :class="getHeadingClasses(heading, index)"
            @click="(e) => scrollToSection(heading.id, e, index)"
            :data-level="heading.level"
            :data-index="index"
          >
            <span class="line-clamp-2">{{ heading.text }}</span>
          </a>
        </div>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface HeadingData {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
  element: HTMLElement;
}

// 响应式状态
const headings = ref<HeadingData[]>([]);
const activeIndex = ref<number>(-1);
const hasHeadings = ref<boolean>(true);
const isSticky = ref<boolean>(true); // 默认启用粘性定位
const isInitialized = ref<boolean>(false);
const tocRef = ref<HTMLDivElement>();

// 防抖计时器引用
let scrollTimeout: number | null = null;

// 获取文档中的标题
const initializeTOC = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    setHasHeadings(false);
    return;
  }
  
  const content = document.getElementById('article-content');
  
  if (!content) {
    setHasHeadings(false);
    return;
  }

  const headingElements = Array.from(content.querySelectorAll('h2, h3, h4')) as HTMLElement[];
  
  if (headingElements.length === 0) {
    setHasHeadings(false);
    return;
  }

  const headingData: HeadingData[] = headingElements.map((heading) => {
    const textContent = heading.textContent || 'heading';
    const id = heading.id || textContent.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    heading.id = id;
    
    return {
      id,
      text: textContent,
      level: heading.tagName.toLowerCase() as 'h2' | 'h3' | 'h4',
      element: heading
    };
  });

  headings.value = headingData;
  setHasHeadings(true);
  isInitialized.value = true;
  
  nextTick(() => {
    handleScroll();
  });
};

const setHasHeadings = (value: boolean) => {
  hasHeadings.value = value;
};

// 滚动时高亮当前章节
const handleScroll = () => {
  if (headings.value.length === 0) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  let currentSectionIndex = -1;
  const scrollPosition = window.scrollY + 120;

  for (let i = headings.value.length - 1; i >= 0; i--) {
    try {
      const heading = headings.value[i];
      const sectionTop = heading.element.getBoundingClientRect().top + window.scrollY;
      
      if (scrollPosition >= sectionTop) {
        currentSectionIndex = i;
        break;
      }
    } catch (error) {
      console.warn('Error accessing heading element:', error);
    }
  }

  // 如果滚动到底部，选择最后一个章节
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
    currentSectionIndex = headings.value.length - 1;
  }

  if (currentSectionIndex !== activeIndex.value && currentSectionIndex !== -1) {
    activeIndex.value = currentSectionIndex;
    
    // 自动滚动目录到可见区域
    scrollTOCIntoView(currentSectionIndex);
  }
};

// 自动滚动目录项到可见区域
const scrollTOCIntoView = (index: number) => {
  if (!tocRef.value) return;
  
  try {
    const tocContainer = tocRef.value.querySelector('#table-of-contents') as HTMLElement;
    if (!tocContainer) return;
    
    const activeLink = tocContainer.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (!activeLink) return;
    
    // 计算目标位置
    const containerRect = tocContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    
    // 如果链接不在可见区域，滚动到中间位置
    if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
      const scrollTop = activeLink.offsetTop - tocContainer.clientHeight / 2 + linkRect.height / 2;
      tocContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  } catch (error) {
    console.warn('Error scrolling TOC into view:', error);
  }
};

// 平滑滚动到指定章节
const scrollToSection = (id: string, event: MouseEvent, clickedIndex: number) => {
  event.preventDefault();
  
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  activeIndex.value = clickedIndex;
  
  const targetElement = document.getElementById(id);
  const targetLink = event.currentTarget as HTMLAnchorElement;

  if (targetElement) {
    try {
      // 点击动画
      targetLink.style.transform = 'scale(0.98)';
      setTimeout(() => {
        targetLink.style.transform = 'scale(1)';
      }, 150);

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } catch (error) {
      console.warn('Error during scroll to section:', error);
      window.location.hash = id;
    }
  }
};

// 获取标题样式类
const getHeadingClasses = (heading: HeadingData, index: number) => {
  const isActive = index === activeIndex.value;
  let classes = [
    'group flex items-center py-2.5 px-4 rounded-lg transition-all duration-200'
  ];

  switch (heading.level) {
    case 'h2':
      classes.push('font-semibold text-gray-700 dark:text-gray-200');
      classes.push('pl-3');
      break;
    case 'h3':
      classes.push('font-medium text-gray-600 dark:text-gray-300');
      classes.push('pl-6');
      break;
    case 'h4':
      classes.push('text-sm text-gray-500 dark:text-gray-400');
      classes.push('pl-9');
      break;
  }

  if (!isActive) {
    classes.push('hover:text-primary dark:hover:text-primary');
  }

  if (isActive) {
    classes.push('text-white bg-primary dark:bg-secondary shadow-sm font-semibold');
  }

  return classes.join(' ');
};

// 防抖处理
const debounce = (func: Function, delay: number) => {
  return () => {
    if (typeof window !== 'undefined') {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => func(), delay);
    }
  };
};

const debouncedScroll = debounce(handleScroll, 20);

// 生命周期钩子
onMounted(() => {
  initializeTOC();

  const timeoutId = setTimeout(() => {
    if (!isInitialized.value) {
      initializeTOC();
    }
  }, 100);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('resize', debouncedScroll, { passive: true });
  }

  nextTick(() => {
    handleScroll();
  });

  return () => {
    clearTimeout(timeoutId);
  };
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', debouncedScroll);
    window.removeEventListener('resize', debouncedScroll);
    if (scrollTimeout) clearTimeout(scrollTimeout);
  }
});
</script>
