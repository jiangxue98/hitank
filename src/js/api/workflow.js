import axios from '@util/axios'
const prefix = '/api'
// 获取数字资产申请流程列表
export const getList = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/list',
    params,
    method: 'post'
  })
}
// 批次审核数字资产申请流程
export const checkWorkflow = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/batchVerifyAssetsItemFlow',
    params,
    method: 'post'
  })
}
// 审核（一级审批流程）--数字资产申请使用流程、数字资产编辑流程
export const checkOneWorkflow = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/verifyAssetsItemFlow',
    params,
    method: 'post'
  })
}
// 审核（二级审批流程）--添加数字资产
export const checkTwoWorkflow = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/verifyAddAssetsItemFlow',
    params,
    method: 'post'
  })
}
// 查询数字资产流程信息
export const getDetail = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlow/findAssetsItemFlow',
    params,
    method: 'post'
  })
}

// 申请添加数字资产/修改审批前的添加申请（创客）
export const getFlowListFlowB = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlowPlanB/list',
    params,
    method: 'post'
  })
}

// 批次审核数字资产申请流程
export const checkWorkflowFlowB = (params) => {
  return axios.request({
    url: prefix + '/assetsItemFlowPlanB/batchVerifyAssetsItemFlow',
    params,
    method: 'post'
  })
}
