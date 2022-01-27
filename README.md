# 简单介绍

## vscode

配置 windicss-intellisense：用于 VS Code 的智能 WindiCSS 工具
配置 Volar，与 vetur 相同，volar 是一个针对 vue 的 vscode 插件，不过与 vetur 不同的是，volar 提供了更为强大的功能，< setup > + TS + Volar = 真香

## commitlint.config.js

前端提交信息规范
官方文档：https://commitlint.js.org/
最新版本的 husky（6.0.0 及以上）配置方法

1. 安装 husky
   npm install -D husky
2. 在 packgae.json 中添加 prepare 脚本
   {
   "scripts": {
   "prepare": "husky install"
   }
   }
   prepare 脚本会在 npm install（不带参数）之后自动执行。也就是说当我们执行 npm install 安装完项目依赖后会执行 husky install 命令，该命令会创建.husky/目录并指定该目录为 git hooks 所在的目录。
3. 添加 git hooks，运行一下命令创建 git hooks
   npx husky add .husky/pre-commit "npm run lint:lint-staged"
   运行完该命令后我们会看到.husky/目录下新增了一个名为 pre-commit 的 shell 脚本。
4. 添加 commit-msg 脚本
   在项目中我们会使用 commit-msg 这个 git hook 来校验我们 commit 时添加的备注信息是否符合规范。
   执行 npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
   由于 Windows 系统的 cmd 是没有$1 这种操作符，所以 windows 应该这样做
   执行 npx husky add .husky/commit-msg
   再手动添加 npx --no-install commitlint --edit "$1"

## vite-plugin-svg-icons

用于生成 svg 雪碧图

## windi.config.ts

windicss 是以 Tailwindcss 为灵感制作的库,windicss 更快、兼容性更好、使用 Typescript 构建,他们解决的问题是类似的。
https://github.com/windicss/docs-cn
https://cn.windicss.org/ 中文地址
https://windicss.org/ 英文地址

## postcss

内联样式如何转换？
webpack 有一 loader：style-vw-loader
而 vite 暂时没有找到解决方法

## dayjs

类 moment.js 的轻量的处理时间和日期的 JavaScript 库

## pinia

何时使用 Pinia，何时使用 Vuex
由于 Pinea 是轻量级的，体积很小，它适合于中小型应用。它也适用于低复杂度的 Vue.js 项目，因为一些调试功能，如时间旅行和编辑仍然不被支持。

将 Vuex 用于中小型 Vue.js 项目是过度的，因为它重量级的，对性能降低有很大影响。因此，Vuex 适用于大规模、高复杂度的 Vue.js 项目。

## eslint

采用 standard-with-typescript 规则

## stylelint

## prettier

## defineComponent 解决了什么

引入 defineComponent() 以正确推断 setup() 组件的参数类型

defineComponent 可以正确适配无 props、数组 props 等形式

defineComponent 可以接受显式的自定义 props 接口或从属性验证对象中自动推断

在 tsx 中，element-ui 等全局注册的组件依然要用 kebab-case 形式

在 tsx 中，v-model 要用 model={{ value, callback }} 写法

在 tsx 中，scoped slots 要用 scopedSlots={{ foo: (scope) => (<Bar/>) }} 写法

defineComponent 并不适用于函数式组件，应使用 RenderContext<interface> 解决

## TypeScript 忽略类型检查

单行忽略(添加到特定行的行前来忽略这一行的错误) // @ts-ignore
跳过对某些文件的检查 (添加到该文件的首行才起作用) // @ts-nocheck
对某些文件的检查 // @ts-check

# 目录结构
