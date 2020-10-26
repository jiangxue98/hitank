import axios from '@util/axios'
const prefix = '/api'
// 上传
export const upload = (params) => {
  return axios.request({
    url: prefix + '/file/singleUpload',
    params,
    method: 'post'
  })
}

// 获取资产类目所有列表
// 暂未使用
export const getAssetClassList = (params) => {
  return axios.request({
    url: prefix + '/assetstype/listAll',
    params,
    method: 'get'
  })
}
// 获取资产类目列表
export const getAssetClassListById = (params) => {
  return axios.request({
    url: prefix + '/assetstype/listByParentId',
    params,
    method: 'get'
  })
}
// 添加资产类目
export const addAssetClass = (params) => {
  return axios.request({
    url: prefix + '/assetstype/saveOrUpdate',
    params,
    method: 'post'
  })
}
// 删除资产类目
export const delAssetClass = (params) => {
  return axios.request({
    url: prefix + '/assetstype/deleteAssetstype',
    params,
    method: 'post'
  })
}
// 获取组织架构所有列表
export const getOrganizationList = (params) => {
  return axios.request({
    url: prefix + '/orgnization/list',
    params,
    method: 'get'
  })
}
// 获取组织架构列表
export const getOrganizationListByName = (params) => {
  return axios.request({
    url: prefix + '/orgnization/findSubOrgnization',
    params,
    method: 'get'
  })
}
// 添加组织架构
export const addOrganizationClass = (params) => {
  return axios.request({
    url: prefix + '/orgnization/saveOrUpdateOrgnization',
    params,
    method: 'post'
  })
}
// 删除组织架构
export const delOrganizationClass = (params) => {
  return axios.request({
    url: prefix + '/orgnization/deleteOrgnization',
    params,
    method: 'post'
  })
}

// 获取组织结构子父级id
export const getOrganizationPath = (params) => {
  return axios.request({
    url: prefix + '/orgnization/findOrgnizationById',
    params,
    method: 'post'
  })
}

// 获取菜单列表
export const getMenulistManage = (params) => {
  return axios.request({
    url: prefix + '/menu/allList',
    params,
    method: 'post'
  })
}

// 更新菜单列表
export const updateMenuList = (params) => {
  return axios.request({
    url: prefix + '/menu/saveOrUpdate',
    params,
    method: 'post'
  })
}

// 删除菜单
export const deleteMenu = (params) => {
  return axios.request({
    url: prefix + '/menu/deleteMenuById',
    params,
    method: 'post'
  })
}
// 获取组织结构子父级id
export const getOrganizationPathByUserId = (params) => {
  return axios.request({
    url: prefix + '/orgnization/findOrgnizationByUserId',
    params,
    method: 'post'
  })
}
// 获取公示信息
export const getnnouncementAList = (params) => {
  return axios.request({
    url: prefix + '/announcement/list',
    params,
    method: 'post'
  })
}
