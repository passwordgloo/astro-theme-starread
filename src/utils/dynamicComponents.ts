export interface WidgetConfig {
  [key: string]: boolean;
}

export type LoadedWidget = {
  key: string;
  component: any;
};