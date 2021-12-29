import { App } from 'vue'

import previewModal from '@/components/preview-modal.vue'
import { SvgIcon } from '@/components/svg-icon'
/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app: App) {
  app.component(previewModal.name, previewModal)
  app.component(SvgIcon.name, SvgIcon)
}
