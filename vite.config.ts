import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import styleImport from 'vite-plugin-style-import';
import { AntDesignVueResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import viteSvgIcons from 'vite-plugin-svg-icons'
import { injectHtml, minifyHtml } from 'vite-plugin-html'
import moment from 'dayjs'
import styleImport, { VantResolve, AndDesignVueResolve } from 'vite-plugin-style-import'
const CWD = process.cwd()

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

export default ({ command, mode }: ConfigEnv): UserConfig => {
    // 环境变量
    const { VITE_BASE_URL, VITE_PX_TO_VW, VITE_API } = loadEnv(mode, CWD)
    const Pxtovw = require('postcss-px-to-viewport')
    const isPXToViewport = VITE_PX_TO_VW === '1'
    const postcssConfig = {
        viewportWidth: 1920, // 设计稿宽度
        unitPrecision: 5, // px转换后的小数保留位数，有时候不能整除
        minPixelValue: 1 // 小于或等于`1px`时不转换为视窗单位
    }
    const pxToViewport = isPXToViewport
        ? {
              postcss: {
                  plugins: [
                      new Pxtovw({
                          ...postcssConfig,
                          selectorBlackList: [], // 不进行转换的css选择器，继续使用原有单位
                          exclude: [] // 忽略某些文件夹下的文件
                      })
                  ]
              }
          }
        : {}
    const isBuild = command === 'build'
    console.log('当前执行环境：', isBuild)

    return {
        base: VITE_BASE_URL,
        esbuild: {
            // target: 'es2015'
        },
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: resolve(__dirname, './src')
                }
            ]
        },
        plugins: [
            vue(),
            styleImport({
                resolves: [VantResolve(), AndDesignVueResolve()],
                libs: [
                    {
                        libraryName: 'vant',
                        esModule: true,
                        resolveStyle: name => `../es/${name}/style`
                    }
                ]
            }),
            WindiCSS(),
            vueJsx({
                // options are passed on to @vue/babel-plugin-jsx
            }),
            legacy({
                targets: ['defaults', 'not IE 11']
            }),
            viteSvgIcons({
                // Specify the icon folder to be cached
                iconDirs: [resolve(CWD, 'src/assets/icons')],
                // Specify symbolId format
                symbolId: 'svg-icon-[dir]-[name]'
            }),
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        exclude: ['AButton']
                    }),
                    VantResolver()
                ]
            }),
            // styleImport({
            //   libs: [
            //     {
            //       libraryName: 'ant-design-vue',
            //       esModule: true,
            //       resolveStyle: (name) => {
            //         return `ant-design-vue/es/${name}/style/index`;
            //       },
            //     },
            //   ],
            // }),
            minifyHtml(),
            injectHtml({
                data: {
                    lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            })
        ],
        css: {
            ...pxToViewport,
            preprocessorOptions: {
                // less: {
                //   modifyVars: {},
                //   javascriptEnabled: true,
                // },
                less: {
                    javascriptEnabled: true,
                    strictMath: false,
                    noIeCompat: true,
                    modifyVars: {
                        '@header-height': '64px',
                        '@footer-height': '70px'
                    }
                }
                // scss: {
                //   additionalData: `
                //   @use 'sass:math';
                //   @import "src/styles/global.scss";
                //   `,
                // },
            }
        },
        server: {
            host: '0.0.0.0',
            port: 9001,
            proxy: {
                '/api': {
                    target: 'http://buqiyuan.site:7001',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                },
                '/pc': {
                    target: VITE_API,
                    changeOrigin: true
                },
                '/chatHub': {
                    target: 'https://127.0.0.1:5001',
                    changeOrigin: true,
                    ws: true, // true/false, if you want to proxy websockets
                    secure: false // true/false, if you want to verify the SSL Certs
                }
            }
        },
        optimizeDeps: {
            // 默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包
            include: ['@ant-design/icons-vue', 'ant-design-vue/es/locale/zh_CN'],
            // 在预构建中强制排除的依赖项
            // Vue Demi是一个让你可以开发同时支持Vue2和3的通用的Vue库的开发工具，而无需担心用户安装的版本
            exclude: ['vue-demi']
        },
        build: {
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_debugger: true,
                    drop_console: false, // true清除console语句
                    pure_funcs: ['console.log'] // 屏蔽console.log
                }
            }
        }
    }
}
