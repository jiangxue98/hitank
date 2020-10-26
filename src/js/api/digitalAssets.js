import axios from '@util/axios'
const prefix = '/api'

// 根据数字资产分类typeId查询数字资产显示的动态字段
export const getAssetsField = (params) => {
  return axios.request({
    url: prefix + '/assets/findAssetsByTypeId',
    params,
    method: 'get'
  })
}

// 添加或更新动态数字资产字段
export const updateAssetsField = (params) => {
  return axios.request({
    url: prefix + '/assets/saveOrUpdate',
    params,
    method: 'get'
  })
}

// 获取动态数字资产字段列表
export const getAssetsFieldList = (params) => {
  return axios.request({
    url: prefix + '/assets/list',
    params,
    method: 'get'
  })
}

// 根据id查询数字资产
export const getAssets = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/findAssetsItemById',
    params,
    method: 'get'
  })
}

//  添加或更新动态数字资产
export const updateAssets = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/saveOrUpdate',
    params,
    method: 'get'
  })
}

//  获取动态数字资产列表
export const getAssetsList = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/list',
    params,
    method: 'get'
  })
}

//  获取动态数字资产搜索列表
export const getAssetsSearchList = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/searchList',
    params,
    method: 'get'
  })
}

//  获取带数字资产类型的数字资产列表
export const getAssetsTypeList = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/listAssetsTypeAndItemAll',
    params,
    method: 'get'
  })
}

//  获取带数字资产类型的数字资产列表
export const getAssetsTypePathList = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/findAssetsTypeByItemId',
    params,
    method: 'get'
  })
}

//  删除动态数字资产
export const deleteAssets = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/deleteSharing',
    params,
    method: 'get'
  })
}

// 上传 废弃！
export const upload = (params) => {
  return axios.request({
    url: prefix + '/file/singleUpload',
    params,
    method: 'post'
  })
}

// 申请使用
export const applyAssets = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/saveOrUpdate',
    params,
    method: 'post'
  })
}

// 申请添加数字资产-或-修改审批前的添加申请（创客）
export const applyAssetsItemAdd = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/applyAssetsItemAdd',
    params,
    method: 'post'
  })
}

// 编辑(通过申请编辑审核的)动态数字资产（创客）
export const editAssetsItem = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/editAssetsItem',
    params,
    method: 'post'
  })
}

// 申请数字资产下架（创客）
export const applyAssetsDown = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/applyAssetsItemDown',
    params,
    method: 'post'
  })
}

// 根据数字资产id查询当前用户是否签订合同信息
export const findSignStateById = (params) => {
  return axios.request({
    url: prefix + '/assetsItemAgreement/findSignStateById',
    params,
    method: 'get'
  })
}

// 查询用户签章信息（创客）
export const getUserstamp = (params) => {
  return axios.request({
    url: prefix + '/assetsItemAgreement/findUserStamp',
    params,
    method: 'post'
  })
}
// 查询用户签章信息（创客）
export const saveAgreement = (params) => {
  return axios.request({
    url: prefix + '/assetsItemAgreement/saveOrUpdate',
    params,
    method: 'post'
  })
}
// 根据id查询数字共享数字资产信息
export const findPublicityAssetsItemById = (params) => {
  return axios.request({
    url: prefix + '/assetsItem/findPublicityAssetsItemById',
    params,
    method: 'post'
  })
}

// 根据id查询数字共享数字资产信息
export const applyAssetsFlowB = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlowPlanB/saveOrUpdate',
    params,
    method: 'post'
  })
}

// 申请添加数字资产/修改审批前的添加申请（创客）
export const applyAssetsItemAddFlowB = (params) => {
  return axios.request({
    url: prefix + '/assetsItemPlanB/applyAssetsItemAdd',
    params,
    method: 'post'
  })
}
// 申请数字资产注销（创客）
export const applyAssetsDownFlowB = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlowPlanB/applyAssetsItemDown',
    params,
    method: 'post'
  })
}
// 操作日志
export const getLogHistore = (params) => {
  return axios.request({
    url: prefix + '/history/list',
    params,
    method: 'post'
  })
}
