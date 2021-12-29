import { App } from 'vue'

import loading from '@/utils/directives/loading'
import tooltip from '@/utils/directives/tooltip'
/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  app.directive('loading', loading)
  app.directive('tooltip', tooltip)
}
