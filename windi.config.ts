// @ts-check - enable TS check for js file
// Vite的Windi CSS又名按需Tailwind CSS
import { defineConfig } from 'vite-plugin-windicss'
import plugin from 'windicss/plugin'
export default defineConfig({
  attributify: true, // 属性化模式 基于这个特性，你可以在 html 属性中编写 windi 类
  darkMode: 'class', //  暗色模式 'class' or 'media'
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        'R': ['AlibabaPuHuiTiR', 'sans-serif'],
        'M': ['AlibabaPuHuiTiM', 'sans-serif'],
        'B': ['AlibabaPuHuiTiB', 'sans-serif'],
        'H': ['AlibabaPuHuiTiH', 'sans-serif'],
      },
      colors: {
        'primary': 'blue',
        'danger': 'red',
      },

    },
  },
  shortcuts: {
    'empty-center': 'w-full h-full flex flex-col items-center justify-center !m-0',
    'btn': {
      'color': 'white',
      '@apply': 'py-2 px-4 inline-block font-semibold rounded-lg',
      '&:hover': {
        '@apply': 'bg-green-700',
        'color': 'black',
      },
    },
    'btn-green': 'text-white bg-green-500 hover:bg-green-700',
    'primary-scrollbar': 'scrollbar-thin scrollbar-thumb-blue-700 overflow-y-auto scrollbar-track-blue-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
  },
  plugins: [
    plugin(({ addComponents }) => {
      const tags = {
        '.tag': {
          '&:hover': {
            opacity: '0.8',
          },
          border: '1px solid',
          borderRadius: '6px',
          padding: '4px',
          display: 'inline-block'
        },
        '.tag-primary': {
          borderColor: 'blue',
          backgroundColor: 'pink'
        }
      }
      addComponents(tags)
    }),
    plugin(({ addDynamic }) => {
      // ?插件源码
      addDynamic("?", ({ Utility, Style, Keyframes }) => {
        if (Utility.raw === '?') {
          return Keyframes.generate('question', {
            '0%': {
              'box-shadow': 'inset 4px 4px rgb(236, 15, 170), inset -4px -4px rgb(236, 15, 170)'
            },
            '100%': {
              'box-shadow': 'inset 8px 8px rgb(236, 15, 170), inset -8px -8px rgb(236, 15, 170)'
            }
          }).concat(Style.generate(Utility.class, {
            '-webkit-animation': `question 0.5s ease-in-out alternate infinite`,
            'animation': `question 0.5s ease-in-out alternate infinite`
          }));
        }
      }, {
        layer: "utilities",
        group: "question",
        completions: ['?']
      })
    }),
    // 表单插件
    require('windicss/plugin/forms'),
    // 滚动条
    require('@windicss/plugin-scrollbar'),
    // 动画
    require('@windicss/plugin-animations')({
      // 参考源码得知 speed的配置 仅这几项支持
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
    // 英雄模式 一组可重复的 SVG 背景图案，供您在 Web 项目中使用。
    require('@windicss/plugin-heropatterns')({
      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      patterns: ['polka-dots', 'signal', 'eyes', 'rain'],
    
      // The foreground colors of the pattern
      colors: {
        'default': '#9C92AC',
        'green': 'green',
        'blue-dark': '#000044', // also works with rgb(0,0,205)
      },
    
      // The foreground opacity
      opacity: {
        default: '0.4',
        50: '0.5',
        100: '1.0',
      },
    })
  ],
  variants: {
    scrollbar: ['rounded'] // 滚动条圆角
  }
})
