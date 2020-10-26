import Vue from 'vue'
import Vuex from 'vuex'

import { getUserInfo } from '@api/login'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appName: '数字资产管理系统',
    userInfo: false,
    roleInfo: false
  },
  getters: {
    userInfo: (state) => state.userInfo,
    roleInfo: (state) => state.roleInfo,
    hasLogin: (state) => {
      return state.userInfo !== false
    }
    // hasPermission: (state) => (permissionId) => {
    //   return state.userInfo.permission.indexOf(permissionId) !== -1
    // }
  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data
    },
    setRoleInfo (state, data) {
      state.roleInfo = data
    },
    logout (state) {
      state.userInfo = false
      state.roleInfo = false
    }
    // setRedirectUrl (state, data) {
    //   console.log('state.redirectUrl=' + state.redirectUrl)
    //   state.redirectUrl = data
    // }
  },
  actions: {
    getUserInfo ({commit}) {
      return new Promise((resolve, reject) => {
        // console.log('action getUserInfo start')
        let user = localStorage.getItem('userInfo')
        if (user && JSON.parse(user) && JSON.parse(user).userId) {
          const {userName, name, userId, role, categoryRelation} = JSON.parse(user)
          commit('setUserInfo', {userName, name, userId, role, categoryRelation})
          // console.log('action getUserInfo localstorage')
          resolve({userName, name, userId, role, categoryRelation})
        } else {
          getUserInfo().then(response => {
            if (response.data) {
              response.data.userId = response.data.id
              response.data.role = response.data.roleMark
              const {userName, name, userId, role, categoryRelation} = response.data
              let userInfo = {
                userName,
                name,
                userId,
                role,
                categoryRelation
              }
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
              commit('setUserInfo', {userName, name, userId, role, categoryRelation})
              // console.log('action getUserInfo 回调：' + userName)
              resolve({userName, name, userId, role, categoryRelation})
            } else {
              resolve({})
            }
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        }
      })
    }
  }
})

export default store
