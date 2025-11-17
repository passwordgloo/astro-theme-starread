/**
 * 动态加载组件工具函数
 * @param widgetComponents 组件映射配置
 * @param sidebarConfig 侧边栏配置
 * @returns 已加载的组件列表
 */
export async function loadDynamicComponents(
  widgetComponents: Record<string, () => Promise<any>>,
  sidebarConfig: Record<string, boolean>
) {
  return await Promise.all(
    Object.entries(widgetComponents)
      .filter(([key]) => sidebarConfig[key])
      .map(async ([key, importFn]) => {
        try {
          const module = await importFn();
          return { key, component: module.default };
        } catch (error) {
          console.error(`Failed to load component ${key}:`, error);
          return null;
        }
      })
      .filter(Boolean)
  );
}