import axios from '@util/axios'
const prefix = '/api'
// 登录
export const login = (params) => {
  return axios.request({
    url: prefix + '/login/login',
    params,
    method: 'post'
  })
}
// 退出登录
export const logout = (params) => {
  return axios.request({
    url: prefix + '/login/logout',
    params,
    method: 'post'
  })
}
// 获取用户信息
export const getUserInfo = (params) => {
  return axios.request({
    url: prefix + '/user/findCurrentUser',
    params,
    method: 'post'
  })
}
// 获取hilook地址
export const getHilookLoginUrl = (params) => {
  return axios.request({
    url: prefix + '/login/getHilookLoginUrl',
    params,
    method: 'post'
  })
}
