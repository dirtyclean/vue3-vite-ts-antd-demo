<!--
/*
 * @Author: dirtyclean
 * @Date: 2021-12-23 14:46:33
 * @Last Modified by: dirtyclean
 * @Last Modified time: 2022-01-27 14:43:11
 */
 suspense组件目前引发的问题，有：路由跳转进入页面，mounted拿不到dom元素, 必须用setTimeout延时；
-->
<template>
    <config-provider :locale="zhCN">
        <router-view v-slot="{ Component }">
            <template v-if="Component">
                <transition mode="out-in">
                    <keep-alive :include="[]">
                        <suspense>
                            <component :is="Component" />
                            <template #fallback>
                                <div
                                    v-loading.fullscreen="true"
                                    loading-size="large"
                                    loading-text="拼命加载中..."
                                ></div>
                            </template>
                        </suspense>
                    </keep-alive>
                </transition>
            </template>
        </router-view>
    </config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
</script>

<style></style>
