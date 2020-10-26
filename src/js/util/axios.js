import axios from 'axios'
import qs from 'qs'
import { message } from 'ant-design-vue'
import store from '@/store'
import router from '@/router'

const config = require('../../../config')

// const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : 'http://39.105.29.12:8585/app/v1'
const baseUrl = config.ENV
const CODE_MAP = {
  SUCCESS: 400200,
  PERMISSION: 400702,
  NO_DATA: 400000,
  NOT_LOGIN: 400401
}
const BUSINESS_CODE_MAP = {
  DEPT_DEL: 400501,
  LOGIN_ERROR: 400402,
  USER_DEPT_ERROR: 400509
}
const NOTIP_CODE_MAP = {
  USER_DEPT_ERROR: 400509
}

class HttpRequest {
  constructor (baseUrl = '') {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: '',
      timeout: 45000,
      headers: {
        //
        // 'cache-control': 'max-age=2592000'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // console.log('=== axios request start  ===' + url)
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      // POST方法，而且不是上传接口时，需要对数据进行qs处理
      if (config.method === 'post' && (url.replace('/', '').substring(0, 6) !== 'upload')) {
        config.headers = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        config.data = qs.stringify({
          ...config.data
        })
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      // console.log('=== axios response success ===' + url)
      const { data } = res
      let code = data ? data.state_code : ''
      // 成功
      if (data && (code === CODE_MAP.SUCCESS)) {
        let total = 0
        if (data.data === undefined || data.data === null || data.data === '') {
          // data.data = {}
          total = 0
        } else {
          if (Array.isArray(data.data)) {
            if (data.data.length > 0) {
              total = data.page && (data.page.totalRecord || data.page.totalRecord === 0) ? data.page.totalRecord : 0
            } else {
              data.data = []
              total = 0
            }
          } else {
            total = true
          }
        }
        return { success: true, data: data.data, total }
      } else if (data && code === CODE_MAP.NO_DATA) {
        // 无数据
        let total = 0
        if (data.data === undefined || data.data === null || data.data === [] || data.data === '') {
          total = 0
        } else {
          total = true
        }
        return { success: true, data: data.data, total }
      } else if (data && code === CODE_MAP.PERMISSION) {
        // 无权限
        router.replace({path: '/manageHome'})
        this.destroy(url)
        console.warn('此用户无此权限')
        return { success: false, data: null }
      } else if (Object.values(BUSINESS_CODE_MAP).includes(code)) {
        // 业务代码报错
        let error = data && data.state_msg ? data.state_msg : '系统异常，请稍后重试'
        if (!Object.values(NOTIP_CODE_MAP).includes(code)) {
          message.error(error)
        }
        return {success: false, data: null}
      } else if (data && code === CODE_MAP.NOT_LOGIN) {
        let to = router.currentRoute
        if (to.meta && to.meta.noLogin && to.meta.noLogin === true) {
          return { success: true, data: data.data }
        } else {
          // 未登录拦截
          store.commit('setUserInfo', false)
          store.commit('setRoleInfo', false)
          // console.log('router.currentRoute.path=' + router.currentRoute.path)
          if (to.path !== '/login') {
            if (to.meta && to.meta.noLogin && to.meta.noLogin === true) {
              router.push({path: '/login'})
            } else {
              router.push({path: '/login', query: {redirectUrl: encodeURI(router.currentRoute.path)}})
            }
          }
          this.destroy(url)
          // return Promise.reject(data.state_msg || '登录拦截')
          console.warn('登录已过期，请重新登录')
          return {success: false, message: data.state_msg || '登录已过期，请重新登录'}
        }
      } else {
        store.commit('setUserInfo', false)
        store.commit('setRoleInfo', false)
        let error = data && data.state_msg ? data.state_msg : '系统异常，请稍后重试'
        this.destroy(url)
        message.error(error)
        return Promise.reject(error)
      }
    }, error => {
      this.destroy(url)
      let resp = error.response
      let data = resp.data
      message.error('系统异常，请稍后重试')
      console.error('%c接口' + data.path + '异常：\n status=' + resp.status + ';\n error=' + data.error + ';\n message=' + data.message + '; \n exception=' + data.exception, 'color: #FF4D4F;font-size:13px;line-height:1.5')
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const httpReq = new HttpRequest(baseUrl)

export default httpReq
