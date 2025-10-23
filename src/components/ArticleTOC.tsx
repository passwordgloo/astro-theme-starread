import React, { useState, useEffect, useRef } from 'react';

interface HeadingData {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
  element: HTMLElement;
}

const ArticleTOC: React.FC = () => {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasHeadings, setHasHeadings] = useState<boolean>(true);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // 获取文档中的标题 - 使用更健壮的方法
  useEffect(() => {
    // 当组件挂载后立即执行一次
    const initializeTOC = () => {
      // 尝试获取文章内容元素
      const content = document.getElementById('article-content');
      
      if (!content) {
        // 如果找不到内容元素，设置状态并尝试再次查找
        setHasHeadings(false);
        return;
      }

      // 查找所有标题元素
      const headingElements = Array.from(content.querySelectorAll('h2, h3, h4')) as HTMLElement[];
      
      if (headingElements.length === 0) {
        setHasHeadings(false);
        return;
      }

      // 为每个标题生成唯一ID并保存
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

      setHeadings(headingData);
      setHasHeadings(true);
      setIsInitialized(true);
    };

    // 立即执行初始化
    initializeTOC();

    // 添加一个小延迟的额外检查，确保内容完全加载
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        initializeTOC();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isInitialized]);

  // 初始化粘性固定功能
  useEffect(() => {
    const handleStickyTOC = () => {
      // 确保在浏览器环境中运行
      if (typeof window === 'undefined') return;
      
      if (!tocRef.current) return;

      try {
        // 粘性逻辑：当目录到达视口顶部附近时固定
        const tocElement = tocRef.current;
        const rect = tocElement.getBoundingClientRect();
        const shouldBeSticky = rect.top <= 100; // 当距离顶部小于100px时固定
        
        // 只有当状态改变时才更新，避免不必要的重渲染
        if (shouldBeSticky !== isSticky) {
          setIsSticky(shouldBeSticky);
        }
      } catch (error) {
        console.warn('Error in sticky TOC handler:', error);
        setIsSticky(false);
      }
    };

    // 使用防抖处理
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleStickyTOC, 30);
    };

    window.addEventListener('scroll', debouncedHandler);
    window.addEventListener('resize', debouncedHandler);
    
    // 初始检查
    handleStickyTOC();

    return () => {
      window.removeEventListener('scroll', debouncedHandler);
      window.removeEventListener('resize', debouncedHandler);
      clearTimeout(timeoutId);
    };
  }, [isSticky]);

  // 滚动时高亮当前章节
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // 确保在浏览器环境中运行
      if (typeof window === 'undefined') return;
      
      let currentSectionIndex = -1;
      const scrollPosition = window.scrollY + 120; // 添加偏移量以提前高亮

      // 改进的检测逻辑：找到第一个顶部位置小于当前滚动位置的标题（从下往上找）
      for (let i = headings.length - 1; i >= 0; i--) {
        try {
          const heading = headings[i];
          const sectionTop = heading.element.getBoundingClientRect().top + window.scrollY;
          
          if (scrollPosition >= sectionTop) {
            currentSectionIndex = i;
            break; // 找到第一个满足条件的标题后退出循环
          }
        } catch (error) {
          console.warn('Error accessing heading element:', error);
        }
      }

      // 如果滚动到底部，选择最后一个章节
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        currentSectionIndex = headings.length - 1;
      }

      // 只有当索引改变时才更新状态，避免不必要的重渲染
      if (currentSectionIndex !== activeIndex && currentSectionIndex !== -1) {
        setActiveIndex(currentSectionIndex);
      }
    };

    // 减少防抖延迟以提高响应速度
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 20); // 从50ms减少到20ms
    };

    window.addEventListener('scroll', debouncedScroll);
    window.addEventListener('resize', debouncedScroll); // 添加resize事件监听
    
    // 初始高亮
    setTimeout(handleScroll, 100); // 稍微延迟执行，确保DOM完全加载

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      window.removeEventListener('resize', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, [headings, activeIndex]);

  // 平滑滚动到指定章节
  const scrollToSection = (id: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    
    // 确保在浏览器环境中运行
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    // 立即更新高亮状态
    const clickedIndex = headings.findIndex(heading => heading.id === id);
    if (clickedIndex !== -1) {
      // 使用函数式更新确保获取最新的状态
      setActiveIndex(prevIndex => {
        return clickedIndex;
      });
    }
    
    const targetElement = document.getElementById(id);

    if (targetElement) {
      try {
        // 添加点击动画效果
        const targetLink = event.currentTarget;
        targetLink.style.transform = 'scale(0.98)';
        setTimeout(() => {
          targetLink.style.transform = 'scale(1)';
        }, 150);

        // 恢复平滑滚动效果
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } catch (error) {
        console.warn('Error during scroll to section:', error);
        // 降级方案：直接跳转
        window.location.hash = id;
      }
    }
  };

  // 获取标题样式类
  const getHeadingClasses = (heading: HeadingData, index: number) => {
    const isActive = index === activeIndex;
    let baseClasses = 'group flex items-center py-2.5 px-4 rounded-lg transition-all duration-200';
    let levelClasses = '';
    let hoverClasses = 'hover:text-primary dark:hover:text-primary';
    let indentClasses = '';
    let activeClasses = '';

    // 根据标题级别设置不同样式
    switch (heading.level) {
      case 'h2':
        levelClasses = 'font-semibold text-gray-700 dark:text-gray-200';
        indentClasses = 'pl-3';
        break;
      case 'h3':
        levelClasses = 'font-medium text-gray-600 dark:text-gray-300';
        indentClasses = 'pl-6';
        break;
      case 'h4':
        levelClasses = 'text-sm text-gray-500 dark:text-gray-400';
        indentClasses = 'pl-9';
        break;
    }

    // 活跃状态样式
    if (isActive) {
      activeClasses = 'text-white bg-primary dark:bg-secondary shadow-sm font-semibold';
    }

    return [baseClasses, indentClasses, levelClasses, hoverClasses, activeClasses].filter(Boolean).join(' ');
  };

  return (
    <div 
      id="article-toc-container" 
      ref={tocRef}
      className={`bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_8px_30px_rgba(0,0,0,0.06)] dark:bg-cyan-950/30 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_30px_rgba(0,0,0,0.35)] rounded-lg shadow-sm p-4 transition-all duration-300 ${isSticky ? 'sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto' : ''}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <span className="icon-[lucide--list-tree] w-5 h-5 text-accent"></span>
        <span className="text-accent font-bold text-lg">文章目录</span>
      </div>
      
      {!hasHeadings ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 mb-3">
            <span className="icon-[lucide--list-tree] w-5 h-5 transition-colors duration-300"></span>
          </div>
          <p className="text-gray-500 dark:text-slate-400 italic">暂无目录</p>
        </div>
      ) : (
        <nav id="table-of-contents" className="text-sm space-y-1 scroll-smooth">
          {headings.map((heading, index) => (
            <div key={heading.id} className="relative">
              <a 
                href={`#${heading.id}`} 
                className={getHeadingClasses(heading, index)}
                onClick={(e) => scrollToSection(heading.id, e)}
                data-level={heading.level}
                data-index={String(index)}
              >
                <span className="line-clamp-2">{heading.text}</span>
              </a>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
};

export default ArticleTOC;