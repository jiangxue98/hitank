import axios from '@util/axios'
const prefix = '/api'
// 获取菜单列表
export const getMenuList = (params) => {
  return axios.request({
    url: prefix + '/menu/list',
    params,
    method: 'get'
  })
}

// 获取菜单列表
export const getMenuAllList = (params) => {
  return axios.request({
    url: prefix + '/menu/allList',
    params,
    method: 'get'
  })
}

// 获取普通用户工作流数据
export const getPlatUserFlow = (params) => {
  return axios.request({
    url: prefix + '/plat/findUserFlow',
    params,
    method: 'get'
  })
}

// 获取菜单列表
export const getPlatAdminFlow = (params) => {
  return axios.request({
    url: prefix + '/plat/findAdminFlow',
    params,
    method: 'get'
  })
}

// 获取菜单列表
export const getSignList = (params) => {
  return axios.request({
    url: prefix + '/assetsItemAgreement/list',
    params,
    method: 'get'
  })
}
