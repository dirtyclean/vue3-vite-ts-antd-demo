import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Storage } from '@/utils/storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import NProgress from 'nprogress' // progress bar
import 'nprogress/css/nprogress.css' // 进度条样式
import shared from './staticModules/shared'
import errorRoutes from './staticModules/error'
import { App } from 'vue'
const createRouterGuards = (router) => {
  router.beforeEach(async (to, from, next) => {
    const isLogin = Storage.get(ACCESS_TOKEN_KEY)
    NProgress.start()
    if (!isLogin && to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
    NProgress.done()
  })
}
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/old',
    component: () => import('@/views/home/old.vue'),
    meta: {
      title: '首页',
    },
  },
  ...shared,
  ...errorRoutes,
]

export const router = createRouter({
  history: createWebHashHistory(''),
  routes,
})

export function setupRouter(app: App) {
  app.use(router)
  createRouterGuards(router)
}
export default router
