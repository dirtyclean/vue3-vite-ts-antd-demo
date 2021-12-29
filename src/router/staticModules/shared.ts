import { RouteRecordRaw } from 'vue-router'

/**
 * 不需要授权就可以访问的页面
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
]

export default routes
