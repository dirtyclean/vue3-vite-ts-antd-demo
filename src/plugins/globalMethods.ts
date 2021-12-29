import { App } from 'vue'

/**
 * 注册全局方法
 * @param app
 */
export function setupGlobalMethods(app: App) {
  app.config.globalProperties.$cs = 'cs'
}
