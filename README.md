# 简单介绍

## vscode
配置windicss-intellisense：用于VS Code的智能WindiCSS工具
配置Volar，与vetur相同，volar是一个针对vue的vscode插件，不过与vetur不同的是，volar提供了更为强大的功能，< setup > + TS + Volar = 真香
## commitlint.config.js
前端提交信息规范
## vite-plugin-svg-icons
用于生成 svg 雪碧图
## windi.config.ts
windicss 是以 Tailwindcss 为灵感制作的库,windicss更快、兼容性更好、使用 Typescript 构建,他们解决的问题是类似的。
## dayjs
类moment.js的轻量的处理时间和日期的 JavaScript 库
## pinia
何时使用Pinia，何时使用Vuex
由于Pinea是轻量级的，体积很小，它适合于中小型应用。它也适用于低复杂度的Vue.js项目，因为一些调试功能，如时间旅行和编辑仍然不被支持。

将 Vuex 用于中小型 Vue.js 项目是过度的，因为它重量级的，对性能降低有很大影响。因此，Vuex 适用于大规模、高复杂度的 Vue.js 项目。
## eslint
采用standard-with-typescript规则
## stylelint
## prettier 
## defineComponent解决了什么
引入 defineComponent() 以正确推断 setup() 组件的参数类型

defineComponent 可以正确适配无 props、数组 props 等形式

defineComponent 可以接受显式的自定义 props 接口或从属性验证对象中自动推断

在 tsx 中，element-ui 等全局注册的组件依然要用 kebab-case 形式

在 tsx 中，v-model 要用 model={{ value, callback }} 写法

在 tsx 中，scoped slots 要用 scopedSlots={{ foo: (scope) => (<Bar/>) }} 写法

defineComponent 并不适用于函数式组件，应使用 RenderContext<interface> 解决

# 目录结构
