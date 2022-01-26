<template>
    <div class="login-box">
        <div class="login-logo">
            <svg-icon name="logo" />
            <!--      <img src="~@/assets/images/logo.png" alt="">-->
            <h1 class="mb-0 ml-2 text-3xl font-bold">vite-vue3-ts-antd</h1>
        </div>
        <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
            <a-form-item>
                <a-input v-model:value="state.formInline.username" size="large" placeholder="rootadmin">
                    <template #prefix><user-outlined type="user" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input
                    v-model:value="state.formInline.password"
                    size="large"
                    type="password"
                    placeholder="123456"
                    autocomplete="new-password"
                >
                    <template #prefix><lock-outlined type="user" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" size="large" :loading="state.loading">登录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/api/login'
import { Storage } from '@/utils/storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
        username: '四川省应急厅',
        password: 'scasstP@ssw0rd'
    }
})

const route = useRoute()
const router = useRouter()
onBeforeUnmount(() => {
    console.log('onBeforeUnmount!')
})
const setToken = (token: string) => {
    const ex = 7 * 24 * 60 * 60 * 1000
    Storage.set(ACCESS_TOKEN_KEY, token, ex)
}
const handleSubmit = async () => {
    const { username, password } = state.formInline
    if (username.trim() === '' || password.trim() === '') {
        return message.warning('用户名或密码不能为空！')
    }
    state.loading = true
    login({
        username,
        password
    })
        .then(({ token }) => {
            state.loading = false
            message.destroy()
            message.success('登录成功！')
            router.push((route.query.redirect as string) ?? '/')
            setToken(token)
        })
        .finally(() => {
            state.loading = false
        })
}
</script>

<style lang="scss" scoped>
.login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    background-size: 100%;
    flex-direction: column;
    align-items: center;

    .login-logo {
        display: flex;
        margin-bottom: 30px;
        align-items: center;

        .svg-icon {
            font-size: 48px;
        }
    }

    :deep(.ant-form) {
        width: 400px;

        .ant-col {
            width: 100%;
        }

        .ant-form-item-label {
            padding-right: 6px;
        }
    }
}
</style>
