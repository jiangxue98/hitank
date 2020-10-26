import axios from '@util/axios'
const prefix = '/api'
// 获取账号授权列表
export const getAuthorizeAccountList = (params) => {
  return axios.request({
    url: prefix + '/authorizeAccountManage/list',
    params,
    method: 'post'
  })
}
// 添加或更新账号授权信息
export const updateAuthorizeAccount = (params) => {
  return axios.request({
    url: prefix + '/authorizeAccountManage/saveOrUpdate',
    params,
    method: 'post'
  })
}
// 跳转至新浪、抖音授权地址
export const gotoAuthorizePage = (params) => {
  return axios.request({
    url: prefix + '/authorizeAccountManage/gotoAuthorizePage',
    params,
    method: 'post'
  })
}
// 根据openid获取token信息
export const getTokenByOpenId = (params) => {
  return axios.request({
    url: prefix + '/authorizeAccountManage/getTokenByOpenId',
    params,
    method: 'post'
  })
}
// Hilook - 添加或更新信息
export const updateHilook = (params) => {
  return axios.request({
    url: prefix + '/hilook/saveOrUpdate',
    params,
    method: 'post'
  })
}
// Hilook列表
export const getHilookList = (params) => {
  return axios.request({
    url: prefix + '/hilook/list',
    params,
    method: 'post'
  })
}
