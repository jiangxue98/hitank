import axios from '@util/axios'
const prefix = '/api'
// 获取产品列表
export const getProductList = (params) => {
  return axios.request({
    url: prefix + '/product/list',
    params,
    method: 'get'
  })
}
// 添加或更新产品信息
export const updateProduct = (params) => {
  return axios.request({
    url: prefix + '/product/saveOrUpdate',
    params,
    method: 'post'
  })
}
// 根据数id查询产品信息
export const getProductById = (params) => {
  return axios.request({
    url: prefix + '/product/findById',
    params,
    method: 'get'
  })
}
// 查询统计数据
export const getProductStatistics = (params) => {
  return axios.request({
    url: prefix + '/product/findStatistics',
    params,
    method: 'get'
  })
}
// 下载产品表格
export const downProductExcel = (params) => {
  return axios.request({
    url: prefix + '/product/downProductExcel',
    params,
    method: 'get'
  })
}
// 获取产品互联网信息列表
export const getProductAssetsItemList = (params) => {
  return axios.request({
    url: prefix + '/product/productAssetsItemList',
    params,
    method: 'get'
  })
}
// 删除 绑定产品 互联网信息
export const deleteBindAssetsItem = (params) => {
  return axios.request({
    url: prefix + '/product/deleteBindAssetsItem',
    params,
    method: 'get'
  })
}
// 绑定产品【互联网】信息
export const bindAssetsItem = (params) => {
  return axios.request({
    url: prefix + '/product/bindAssetsItem',
    params,
    method: 'get'
  })
}
// 获取产品【变更】列表
export const getProductChangeList = (params) => {
  return axios.request({
    url: prefix + '/product/productChangeList',
    params,
    method: 'get'
  })
}
// 获取产品【发布】列表
export const getProductPublishList = (params) => {
  return axios.request({
    url: prefix + '/product/productPublishList',
    params,
    method: 'get'
  })
}
// 获取产品【冻结】列表
export const getProductFreezeList = (params) => {
  return axios.request({
    url: prefix + '/product/productFreezeList',
    params,
    method: 'get'
  })
}
// 获取产品【下架】列表
export const getProductDownList = (params) => {
  return axios.request({
    url: prefix + '/product/productDownList',
    params,
    method: 'get'
  })
}
// 产品信息【发布】
export const productPublish = (params) => {
  return axios.request({
    url: prefix + '/product/productPublish',
    params,
    method: 'get'
  })
}
// 产品信息【下架】
export const productDown = (params) => {
  return axios.request({
    url: prefix + '/product/productDown',
    params,
    method: 'get'
  })
}
// 产品信息【冻结】
export const productFreeze = (params) => {
  return axios.request({
    url: prefix + '/product/productFreeze',
    params,
    method: 'get'
  })
}
// 产品信息【变更】
export const productChange = (params) => {
  return axios.request({
    url: prefix + '/product/productChange',
    params,
    method: 'get'
  })
}
// 获取未选取动态数字资产列表
export const getAssetsItemUnSelectlist = (params) => {
  return axios.request({
    url: prefix + '/product/assetsItemUnSelectlist',
    params,
    method: 'get'
  })
}
// 获取产品计划列表
export const getProductPlanList = (params) => {
  return axios.request({
    url: prefix + '/productPlan/list',
    params,
    method: 'get'
  })
}
// 获取产品计划列表
export const addProductPlan = (params) => {
  return axios.request({
    url: prefix + '/productPlan/saveOrUpdate',
    params,
    method: 'post'
  })
}
// 获取产品反馈列表
export const getPlanFeedback = (params) => {
  return axios.request({
    url: prefix + '/productPlan/listPlanFeeback',
    params,
    method: 'post'
  })
}
// 添加或更新产品计划反馈信息
export const addPlanFeedback = (params) => {
  return axios.request({
    url: prefix + '/productPlan/saveFeedback',
    params,
    method: 'post'
  })
}
// 完成产品计划
export const complateProductPlan = (params) => {
  return axios.request({
    url: prefix + '/productPlan/complateProductPlan',
    params,
    method: 'post'
  })
}
