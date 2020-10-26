<template>
  <a-dropdown class="fr" :trigger="['click']">
    <a class="ant-dropdown-link" href="#">
      <hitank-avatar class="dis-inbl mar-r-5" :size="24" :role="userInfo.role" :name="userInfo.name?userInfo.name:userInfo.userName"></hitank-avatar>
      {{userInfo.name?userInfo.name:userInfo.userName}}
      <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
<!--          <a-menu-item key="0">-->
<!--            <a @click="setting()">个人设置</a>-->
<!--          </a-menu-item>-->
      <a-menu-item key="1">
        <a @click="logout()"><a-icon type="logout" />退出登录</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {logout} from '@api/login'
import store from '@/store'
import HitankAvatar from '../manageHome/HitankAvatar'
export default {
  components: {HitankAvatar},
  data () {
    return {
      userInfo: {}
    }
  },
  mounted () {
    store.dispatch('getUserInfo').then(userInfo => {
      this.userInfo = userInfo
      this.$emit('getUserInfo', userInfo)
    }).catch((err) => {
      console.log('获取用户信息错误：' + err)
    })
  },
  methods: {
    setting () {
      this.$router.push({path: '/roleList'})
    },
    logout () {
      let _this = this
      logout().then(function (data) {
        store.commit('logout')
        localStorage.removeItem('userInfo')
        _this.$router.push({path: '/login'})
      })
    }
  }
}
</script>

<style scoped lang="less">
.avatar{
  width: 24px;
  height: 24px;
  border-radius: 24px;
  margin-right: 8px;
}
</style>
