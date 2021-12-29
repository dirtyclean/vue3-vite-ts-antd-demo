import { request } from '@/utils/request'

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request<API.LoginResult>(
    {
      url: '/pc/v1/login',
      method: 'post',
      params: data,
    },
    {
      isGetDataDirectly: true,
    },
  )
}
