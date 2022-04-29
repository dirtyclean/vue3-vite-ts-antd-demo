import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Storage } from '@/utils/storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import NProgress from 'nprogress' // progress bar
import 'nprogress/css/nprogress.css' // 进度条样式
import shared from './staticModules/shared'
import errorRoutes from './staticModules/error'
import { App } from 'vue'
const createRouterGuards = router => {
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
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: async () => await import('@/views/home/index.vue'),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/old',
        component: async () => await import('@/views/home/old.vue'),
        meta: {
            title: 'old'
        }
    },
    {
        path: '/signalr',
        component: async () => await import('@/views/home/signalr.vue'),
        meta: {
            title: 'signalr'
        }
    },
    {
        path: '/windicss',
        component: async () => await import('@/views/home/windicss.vue'),
        meta: {
            title: 'windicss'
        }
    },
    {
        path: '/d3Demo',
        component: async () => await import('@/views/home/d3Demo.vue'),
        meta: {
            title: 'd3Demo'
        }
    },
    {
        path: '/css',
        component: async () => await import('@/views/home/css.vue'),
        meta: {
            title: 'css'
        }
    },
    ...shared,
    ...errorRoutes
]

export const router = createRouter({
    history: createWebHashHistory(''),
    routes
})

export function setupRouter(app: App) {
    app.use(router)
    createRouterGuards(router)
}
export default router
