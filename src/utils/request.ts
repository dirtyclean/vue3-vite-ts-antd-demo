import axios, { AxiosRequestConfig } from 'axios'
import { message as $message } from 'ant-design-vue'
import { ACCESS_TOKEN_KEY, TOKEN_PREFIX } from '@/enums/cacheEnum'
import { Storage } from '@/utils/storage'
// import {ExclamationCircleOutlined} from '@ant-design/icons'

export interface RequestOptions {
    /** 是否直接获取data，而忽略message等 */
    isGetDataDirectly?: boolean
    /** 请求成功是提示信息 */
    successMsg?: string
    /** 请求失败是提示信息 */
    errorMsg?: string
}

const UNKNOWN_ERROR = '未知错误，请重试'

/** 真实请求的路径前缀 */
const baseApiUrl = import.meta.env.VITE_BASE_API
const service = axios.create({
    baseURL: baseApiUrl,
    timeout: 60 * 1000
})
service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
service.interceptors.request.use(
    config => {
        const token: string = Storage.get(ACCESS_TOKEN_KEY)
        if (token && config.headers) {
            // 请求头token信息，请根据实际情况进行修改
            config.headers.Authorization = TOKEN_PREFIX + token
        }
        return config
    },
    async error => {
        return await Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res: any = response.data

        // if the custom code is not 200, it is judged as an error.
        if (res.code !== 200 && res.code !== '200') {
            void $message.error(res.message || UNKNOWN_ERROR)

            // Illegal token
            if (res.code === 11001 || res.code === 11002) {
                window.localStorage.clear()
                window.location.reload()
                // to re-login
                // Modal.confirm({
                //   title: '警告',
                //   content: res.message || '账号异常，您可以取消停留在该页上，或重新登录',
                //   okText: '重新登录',
                //   cancelText: '取消',
                //   onOk: () => {
                //     localStorage.clear();
                //     window.location.reload();
                //   }
                // });
            }

            // throw other
            const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any }
            error.code = res.code
            return Promise.reject(error)
        } else {
            return res
        }
    },
    async error => {
        // 处理 422 或者 500 的错误异常提示
        const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR
        void $message.error(errMsg)
        error.message = errMsg
        return await Promise.reject(error)
    }
)

export interface Response<T = any> {
    code: number
    message: string
    data: T
}

export type BaseResponse<T = any> = Promise<Response<T>>

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<T> => {
    try {
        const { successMsg, errorMsg, isGetDataDirectly = true } = options
        const res = await service.request(config)
        successMsg && $message.success(successMsg)
        errorMsg && $message.error(errorMsg)
        console.log(res, '===res===')
        return isGetDataDirectly ? res.data : res
    } catch (error: any) {
        return await Promise.reject(error)
    }
}
