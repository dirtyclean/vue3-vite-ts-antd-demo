<!--
/*
 * @Author: dirtyclean 
 * @Date: 2021-07-17 16:11:22 
 * @Last Modified by: dirtyclean
 * @Last Modified time: 2021-12-28 16:47:54
 */
 api:
    修饰符  .fullscreen 全屏
            .body 是否要绑定在 body 上
    自定义属性  loading-text 显示的文字
               loading-background 背景颜色
               loading-custom-class 自定义class
               loading-size 取值：'default'/'large'/'small'

 -->
<template>
    <div
        class="loading-mask"
        v-show="visibleValue"
        :class="[customClass, { 'is-fullScreen': fullscreen }]"
        :style="{ backgroundColor: background || '' }"
    >
        <div
            class="ant-spin ant-spin-spinning"
            :class="size === 'small' ? 'ant-spin-sm' : size === 'large' ? 'ant-spin-lg' : ''"
        >
            <span class="ant-spin-dot ant-spin-dot-spin">
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
            </span>
            <div :class="'loading-text' + '-' + size">{{ textValue }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fullscreen: Boolean,
        background: String,
        text: String,
        customClass: String,
        visible: Boolean,
        size: {
            type: String,
            default: 'default'
        }
    },
    data() {
        return {
            textValue: this.text,
            visibleValue: this.visible
        }
    },
    beforeUnmount() {
        console.log('beforeUnmount')
    },
    methods: {
        setText(text) {
            this.textValue = text
        },
        setVisible(visible) {
            this.visibleValue = visible
        }
    }
}
</script>

<style lang="scss">
.loading-parent--relative {
    position: relative !important;
}
.loading-mask {
    position: absolute;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: hsla(0, 0%, 100%, 0.5);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity 0.3s;
}
.is-fullScreen {
    @extend .loading-mask;
    width: 100vw;
    height: 100vh;
}
.loading-text-default {
    font-size: 12px;
}
.loading-text-small {
    font-size: 16px;
}
.loading-text-large {
    font-size: 18px;
}
</style>
