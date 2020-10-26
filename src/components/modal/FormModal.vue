<!--逐渐废弃，不推荐使用-->
<template>
  <div class="form-modal">
    <a-modal
      width="640px"
      :title="title"
      :visible="showModal"
      :confirmLoading="confirmLoading"
      :showTip="showTip"
      :afterClose = "afterClose"
      :destroyOnClose = true
      @cancel = "handleCancel"
    >
      <slot></slot>
      <template slot="footer">
        <div class="error-tips" v-if="showTip.error!==false">{{showTip.error}}</div>
        <a-button key="back" @click="handleCancel">{{cancelText}}</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">
          {{okText}}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import global from '@util/global'

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    // params: {
    //   type: Object,
    //   required: false
    // },
    showTip: {
      type: Object,
      default () {
        return {
          error: false
        }
      },
      required: false
    },
    okBtn: {
      type: String,
      default: global.TEXT.OK,
      required: false
    },
    cancelBtn: {
      type: String,
      default: global.TEXT.CANCEL,
      required: false
    },
    closeModal: {
      type: Function,
      default () {
        return {
          function () {
            this.$emit('cancel')
          }
        }
      }
    }
  },
  components: {
  },
  data () {
    return {
      okText: this.okBtn ? this.okBtn : global.TEXT.OK,
      cancelText: this.cancelBtn ? this.cancelBtn : global.TEXT.CANCEL,
      confirmLoading: false
      // form: this.$form.createForm(this)
    }
  },
  methods: {
    handleOk (e) {
      this.$emit('ok')
    },
    handleCancel (e) {
      this.$emit('cancel')
    },
    // closeModal (e) {
    //   this.$emit('close')
    // },
    afterClose () {
      this.showTip.error = false
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
.error-tips{
  float: left;
  color: @red;
}
</style>
