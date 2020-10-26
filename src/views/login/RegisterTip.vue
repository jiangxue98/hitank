<template>
  <div class="container">
    <div class="content">
      <div class="back" @click="handleBack"><a-icon type="left-circle" />返回登录页</div>
      <div class="bg-box">
        <div><img class="empty" src="@img/login/empty.png"/> </div>
        <div class="mar-d-20">
          没有找到该用户信息，请联系hitank管理员
        </div>
        <div class="address">
          <div style="margin-bottom: 8px">电话：17854295899</div>
          <div>邮箱：zhzc.wangxuanqi@haier.com</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    handleBack () {
      this.$router.push({path: '/login'})
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
  .container {
    background-color: #f9f9f9;
  }
  .content {
    min-height: 405px;
    height: calc(100vh - 80px);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    .back {
      color: @theme;
      text-align: left;
      width: 368px;
      cursor: pointer;
      .anticon {
        margin-right: 5px;
      }
    }
    .bg-box {
      padding: 24px 16px;
      color: @blackText;
      background-color: @fff;
      border-radius:4px;
      width:368px;
      height:294px;
      margin-top: 10px;
      box-sizing: border-box;
      text-align: center;
    }
    .empty{
      width:107px;
      margin-bottom: 22px;
    }
    .address{
      width:336px;
      height:84px;
      border-radius:4px;
      border:1px solid @sep;
      color: @blackBody;
      padding: 16px 38px;
      text-align: left;
      line-height: 22px;
    }
  }
</style>
