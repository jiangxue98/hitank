import axios from '@util/axios'
const prefix = '/api'
// 获取消息列表
export const getMessageList = (params) => {
  return axios.request({
    url: prefix + '/message/list',
    params,
    method: 'post'
  })
}
// 设定消息已读
export const setMessageHasRead = (params) => {
  return axios.request({
    url: prefix + '/message/setMessageHasRead',
    params,
    method: 'post'
  })
}
//  批量设定消息已读
export const batchSetMessageHasRead = (params) => {
  return axios.request({
    url: prefix + '/message/batchSetMessageHasRead',
    params,
    method: 'post'
  })
}
// 删除消息
export const deleteMessage = (params) => {
  return axios.request({
    url: prefix + '/message/deleteMessage',
    params,
    method: 'post'
  })
}
// 批量删除消息
export const batchDeleteMessage = (params) => {
  return axios.request({
    url: prefix + '/message/batchDeleteMessage',
    params,
    method: 'post'
  })
}
