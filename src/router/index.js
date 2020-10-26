import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  // base: '/api/',
  routes,
  mode: 'history'
})

// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 守卫 - 需要登录的页面先获取用户信息
router.beforeEach((to, from, next) => {
  // console.log('=== beforeEach ===')
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 不需登录拦截的页面
  if (to.meta && to.meta.noLogin && to.meta.noLogin === true) {
    next()
  } else {
    // 登录拦截
    // 登录
    if (store.getters.hasLogin) {
      next()
      // if (from.name === 'login' && from.query && from.query.redirectUrl) {
      //   this.$router.push({ path: decodeURI(from.query.redirectUrl) })
      //   console.log('to.query.redirectUrl=' + decodeURI(from.query.redirectUrl))
      //   // next({ path: decodeURI(from.query.redirectUrl) })
      //   next()
      // } else {
      //   next()
      // }
      // store.dispatch('getUserInfo').then(userInfo => {
      //   // 也可以写一些验证啊之类的逻辑 比如没有绑定手机号强制跳转到绑定页
      //   // 比如验证访问权限，根据 to.meta.access 里面存上能访问的 role_id 然后和 userInfo 返回的对比 等等
      //   next()
      // }).catch((err) => {
      //   console.log('获取用户信息错误' + err)
      //   // next({name:'error'});
      // })
    } else {
      // 未登录，跳转登录页面
      // if (to.name !== 'login') {
      //   this.$router.replace({path: '/login'})
      // }
      // this.$router.replace({path: '/login'})
      // store.dispatch('getUserInfo').then(userInfo => {
      //   // 也可以写一些验证啊之类的逻辑 比如没有绑定手机号强制跳转到绑定页
      //   // 比如验证访问权限，根据 to.meta.access 里面存上能访问的 role_id 然后和 userInfo 返回的对比 等等
      //   next()
      // }).catch((err) => {
      //   console.log('获取用户信息错误' + err)
      // })
      // this.$router.push({path: '/login'})
      next()
    }
  }
})

router.afterEach(to => {
  // console.log('=== afterEach ===')
  window.scrollTo(0, 0)
})

export default router
