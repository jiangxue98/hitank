<template>
  <div class="building">
<!--    <div class="box">-->
      <empty class="emp box" type="building"></empty>
<!--    </div>-->
  </div>
</template>
<script>
import Empty from '../../components/Empty'
export default {
  components: {Empty}
}
</script>
<style scoped lang="less">
  @import "~@var";
  .building{
    background-color: @bg;
    height: 100vh;
    .box{
      width: 1128px;
      height: calc(100vh - 80px - 24px - 30px);
      background-color: @fff;
      /*text-align: center;*/
      margin: 24px auto 30px;
      /*min-height: 164px;*/
      /*padding-bottom: 24px;*/
      .emp{
        /*padding-top: 244px;*/
      }
    }
  }
</style>
