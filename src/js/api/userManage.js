import axios from '@util/axios'
const prefix = '/api'
// 获取用户列表
export const getUserList = (params) => {
  return axios.request({
    url: prefix + '/user/list',
    params,
    method: 'get'
  })
}
// 获取用户列表
export const getUserSelectList = (params) => {
  return axios.request({
    url: prefix + '/user/userSelectList',
    params,
    method: 'get'
  })
}

// 添加&更新用户信息
export const updateUserInfo = (params) => {
  return axios.request({
    url: prefix + '/user/saveOrUpdate',
    params,
    method: 'post'
  })
}

// 获取角色列表
export const getRoleList = (params) => {
  return axios.request({
    url: prefix + '/role/list',
    params,
    method: 'get'
  })
}

// 获取角色绑定的权限信息
export const getRoleRight = (params) => {
  return axios.request({
    url: prefix + '/role/getRoleResources',
    params,
    method: 'get'
  })
}
// 给角色绑定权限信息
export const setRoleRight = (params) => {
  return axios.request({
    url: prefix + '/role/updateRoleResources',
    params,
    method: 'get'
  })
}
// 删除用户
export const delUser = (params) => {
  return axios.request({
    url: prefix + '/user/delete',
    params,
    method: 'get'
  })
}
// 批量删除用户
export const batchDeleteUser = (params) => {
  return axios.request({
    url: prefix + '/user/batchDelete',
    params,
    method: 'get'
  })
}
// 通过用户找小微主
export const findUserByOrgnizationId = (params) => {
  return axios.request({
    url: prefix + '/user/findUserByOrgnizationId',
    params,
    method: 'get'
  })
}
