import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
  },
  {
    path: '/notChild',
    component: () => import('@/views/error-page/404.vue'),
    name: 'notChild',
  },
  {
    path: '/noPermission', // 无任何权限
    component: () => import('@/views/error-page/404.vue'),
    name: 'noPermission',
  },
]

export default routes
