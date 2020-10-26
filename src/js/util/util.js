import {Modal} from 'ant-design-vue'

let TABLE = {
  emptyText: '暂无数据',
  locale: {
    emptyText: '暂无数据'
  },
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
}
let TABLE_S = {
  emptyText: '暂无数据',
  locale: {
    emptyText: '暂无数据'
  },
  pagination: {
    total: 0,
    current: 1,
    pageSize: 5
  }
}

/**
 * 判空
 * @param v
 * @returns {boolean}
 */
function isEmpty (v) {
  if (v === undefined || v === '' || (typeof (v) === 'string' && v.trim() === '') || v === null) {
    return true
  } else {
    return false
  }
}

/**
 * 日期转换格式
 * @param time
 * @param separate
 * @returns {string}
 */
function formatDate (time, separate) {
  function formatTimeZero (num) {
    if (num < 10) {
      return '0' + num
    }
    return num
  }

  if (time) {
    if (time instanceof Date) {
    } else {
      time = parseInt(time)
    }
    let str = ''
    let date = new Date(time)
    if (!separate) {
      separate = '-'
    }
    str = date.getFullYear() + separate + formatTimeZero(date.getMonth() + 1) + separate + formatTimeZero(date.getDate())
    return str
  } else {
    return ''
  }
}

/**
 * 带时间戳的指定n位数的随机整数
 * @param n  指定n位数
 *
 */
function random (n, prefix = '') {
  let rnd = ''
  for (let i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10)
  }
  return prefix + new Date().getTime() + rnd.toString()
}

/**
 * 判断是否含有中文
 * @param str
 * @returns {boolean}
 */
function isChinese (str) {
  if (escape(str).indexOf('%u') !== -1) {
    // 字符串 str 中含有汉字（含中文标点）
    return true
  } else {
    return false
  }
}
/**
 * 判断是否图片格式
 * @param str
 * @returns {boolean}
 */
function isImg (type) {
  return type.indexOf('image/') > -1
}

/**
 * 判断是否视频格式
 * @param str
 * @returns {boolean}
 */
function isVideo (type) {
  return type.indexOf('video/') > -1
}

/**
 * 处理upload的fileList数据，获取后端入参格式
 * 格式示例：[{"id":"1","name":"文件1","type":1,"url":"www.baidu.com"},{"id":"2","name":"文件2","type":3,"url":"www.baidu.com"}] 字段说明：type：1文件，2图片，3视频。
 * @param files
 * @param prefix
 * @returns {string}
 */
function convertFile (files, prefix) {
  let data = []
  for (let arr of files) {
    let type = 1
    if (this.isImg(arr.type)) {
      type = 2
    }
    if (this.isVideo(arr.type)) {
      type = 3
    }
    let newV = {
      id: this.random(3, prefix),
      type,
      name: arr.name,
      url: arr.response.data.url
    }
    data.push(newV)
  }
  return JSON.stringify(data)
}

/**
 * 转换级联<a-cascader>数据键值格式（格式化value、label和children）
 * @param data 源数据
 * @param key 后端对应的key值的名称
 * @param children 后端对应的tree子集的名称
 * @returns {*}
 */
function convertCascaderData (data, value, label, children) {
  if (Array.isArray(data)) {
    value = value || 'value'
    label = label || 'label'
    children = children || 'children'
    for (let elem of data.values()) {
      elem['value'] = elem[value]
      elem['label'] = elem[label]
      if (elem[children] && elem[children].length > 0) {
        elem['children'] = elem[children]
        convertCascaderData(elem[children], value, label, children)
      } else {
        delete elem[children]
      }
    }
  }
  return data
}

/**
 * 转换表格tree结构的数据键值格式（格式化key和children）
 * @param data 源数据
 * @param key 后端对应的key值的名称
 * @param children 后端对应的tree子集的名称
 * @returns {*}
 */
function convertTableTreeData (data, key, children) {
  if (Array.isArray(data)) {
    key = key || 'key'
    children = children || 'children'
    for (let elem of data.values()) {
      elem['key'] = elem[key]
      if (elem[children] && elem[children].length > 0) {
        elem['children'] = elem[children]
        convertTableTreeData(elem[children], key, children)
      } else {
        delete elem[children]
      }
    }
  }
  return data
}

/**
 * 转换tree结构的数据键值格式（格式化key、title和children）
 * @param data 源数据
 * @param key 后端对应的id的名称
 * @param title 后端对应的的名称
 * @param children 后端对应的tree子集的名称
 * @returns {*}
 */
function convertTreeData (data, key, title, children) {
  if (Array.isArray(data)) {
    key = key || 'key'
    title = title || 'title'
    children = children || 'children'
    for (let elem of data.values()) {
      elem['key'] = elem[key]
      elem['title'] = elem[title]
      if (elem[children] && elem[children].length > 0) {
        elem['children'] = elem[children]
        convertTreeData(elem[children], key, title, children)
      } else {
        delete elem[children]
      }
    }
  }
  return data
}

/**
 * 【表格】
 * 过滤表格数据，防止null字段报错（暂只转换第一层数据）
 * @param arr [Array]
 */
function filterTableData (arr) {
  for (let obj of arr) {
    for (let j in obj) {
      if (isEmpty(obj[j])) {
        obj[j] = ''
      }
    }
  }
  return arr
}

/**
 * 将null字段过滤成' '【针对于查看页面，使其不显示input的placeholder情况】
 * @param obj
 * @returns {*}
 */
function convertObjDataEmpty (obj) {
  for (let o in obj) {
    if (isEmpty(obj[o])) {
      obj[o] = ' '
    }
  }
  return obj
}

/**
 * 删除提示框
 * @param name
 * @param okFunc
 */
function delConfirm (name, okFunc) {
  Modal.confirm({
    title: '删除确认',
    content: '是否要删除' + name,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk () {
      okFunc()
    },
    onCancel () {
      console.log('Cancel')
    }
  })
}

/**
 * 获取url地址参数(兼容hash地址)
 * @param name
 * @returns {*}
 */
function getUrlParam (name, sourceUrl) {
  let win = window.location.search || '?' + window.location.hash.split('?')[1]
  let url = win
  if (sourceUrl) {
    url = '?' + sourceUrl.split('?')[1]
  }
  var theRequest = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    let strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest[name]
}

/**
 * 设置cookie
 * @param name
 * @param val
 * @param exday
 */
function setCookie (name, val, exday) {
  let d = new Date()
  let expires = ''
  if (exday) {
    d.setTime(d.getTime() + (exday * 24 * 60 * 60 * 1000))
    expires = '; expires=' + d.toGMTString()
  }
  document.cookie = name + '=' + val + expires
}

/**
 * 获取cookie
 * @param name
 * @returns {string}
 */
function getCookie (name) {
  let data = ''
  if (document.cookie) {
    let arr = document.cookie.split(';')
    for (let str of arr) {
      let temp = str.split('=')
      if (temp[0].replace(/(^\s*)/g, '') === name) {
        data = unescape(temp[1])
        break
      }
    }
  } else {
    console.warn('cookie不存在')
  }
  return data
}

/**
 * 清除cookie值
 * @param name
 */
function clearCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let val = getCookie(name)
  if (val != null) document.cookie = name + '=' + val + ';expires=' + exp.toGMTString()
}

function compare (objKey) {
  return function (obj1, obj2) {
    let val1 = obj1[objKey]
    let val2 = obj2[objKey]
    return val1 - val2
  }
}

/**
 * 根据指定的属性将数组对象重新排序
 * @param arr
 * @param objKey
 */
function objArraySort (arr, objKey) {
  return arr.sort(this.compare(objKey))
}

/**
 * 根据指定的属性移除某数组对象
 * @param arr
 * @param objKey
 * @param objVal
 * @returns {*|T[]}
 */
function objArrayRemove (arr, objKey, objVal) {
  let obj = arr.find((value) => {
    return value[objKey] === objVal
  })
  let index = arr.indexOf(obj)
  return arr.splice(index, 1)
}

/**
 * 深拷贝
 * @param data
 * @returns {*}
 */
function deepClone (data) {
  let obj
  if (typeof data === 'object') {
    let temp = JSON.stringify(data)
    obj = JSON.parse(temp)
  } else {
    obj = data
  }
  return obj
}

export default {
  TABLE,
  TABLE_S,
  isEmpty,
  formatDate,
  random,
  isChinese,
  isImg,
  isVideo,
  convertFile,
  convertCascaderData,
  convertTableTreeData,
  convertTreeData,
  filterTableData,
  convertObjDataEmpty,
  getUrlParam,
  setCookie,
  getCookie,
  clearCookie,
  compare,
  objArraySort,
  objArrayRemove,
  deepClone,
  delConfirm
}
