declare module "astro-theme-starread" {
  import type { AstroIntegration } from "astro";

  // 导入你的函数类型
  export default function starreadTheme(): AstroIntegration;
}

// 以下是可选声明（如果要给组件加类型提示）
declare module "astro-theme-starread/components/NavBar.astro" {
  const Component: any;
  export default Component;
}
