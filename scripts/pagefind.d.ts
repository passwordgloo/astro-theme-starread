// Pagefind UI 类型声明文件

// 为 Window 对象扩展 PagefindUI 类型
declare interface Window {
  PagefindUI: {
    new (options: PagefindUIOptions): PagefindUIInstance;
  };
}

// Pagefind UI 初始化选项接口
declare interface PagefindUIOptions {
  element: string;
  bundlePath: string;
  showSubResults?: boolean;
  excerptLength?: number;
  showImages?: boolean;
  showEmptyFilters?: boolean;
  debounceTimeoutMs?: number;
  [key: string]: any;
}

// Pagefind UI 实例接口
declare interface PagefindUIInstance {
  triggerSearch: (query: string) => void;
  [key: string]: any;
}