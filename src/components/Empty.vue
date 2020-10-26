<template>
  <div class="empty-box" :class="type=='empty'?'textTop':''" :style="styles">
    <img v-if="type=='building'" src="@img/empty/constructing.png">
    <img v-if="type=='search' || type=='empty'" src="@img/empty/noData.png">
    <p>{{emptyText}}</p>
  </div>
</template>
<script>
import util from '@util/util'
export default {
  props: {
    type: { // empty:暂无数据；building:正在建设中；search：未搜索到相关内容；
      name: String,
      required: false,
      default () {
        return 'empty'
      }
    },
    styles: {
      name: String,
      required: false
    },
    text: {
      name: String,
      required: false
    }
  },
  data () {
    return {
      emptyText: ''
    }
  },
  mounted () {
    if (util.isEmpty(this.text)) {
      if (!util.isEmpty(this.type)) {
        switch (this.type) {
          case 'empty':
            this.emptyText = '暂无内容'
            break
          case 'building':
            this.emptyText = '正在建设中'
            break
          case 'search':
            this.emptyText = '未搜索到相关内容'
            break
        }
      }
    } else {
      this.emptyText = this.text
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~@var";
  .empty-box{
    min-height: 184px;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    color: @blackText;
    p{
      margin-top: 23px;
      margin-bottom: 0;
    }
  }
  .empty-box.textTop{
    /*padding-top: 50%;*/
  }
</style>
