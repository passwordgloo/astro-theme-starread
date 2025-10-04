// Astro Theme Starread 入口文件
// 这个文件作为主题包的主入口点，允许用户从 node_modules 中导入组件、布局和页面

// 导出组件
export * from './src/components/index.js';

// 导出布局
export * from './src/layouts/index.js';

// 导出默认配置
export { themeConfig } from './starread.config';