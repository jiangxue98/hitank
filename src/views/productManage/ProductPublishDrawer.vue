<template>
  <div>
    <a-drawer
      :title="'产品发布'"
      width="720"
      @close="onClose"
      :destroyOnClose = true
      :visible="showDrawer"
    >
      <div class="drawer-form-box asset-class-item-drawer-form" :class="isSee?'see-view':''">
        <a-form :form="form" layout="vertical" hideRequiredMark>
          <a-form-item label="发布名称">
            <a-input class="disabled-cover" :disabled="isSee"
                     v-decorator="['name', { rules: [{ required: true, message: '请输入' }]}]"
                     placeholder="请输入"
            ></a-input>
          </a-form-item>
          <a-form-item label="版本">
            <a-input class="disabled-cover" :disabled="isSee"
                     v-decorator="['version', { rules: [{ required: true, message: '请输入' }] }]"
                     placeholder="请输入"
            ></a-input>
          </a-form-item>
          <a-form-item label="发布时间">
            <a-date-picker :disabled="isSee" style="width: 100%" class="disabled-cover"
                           v-decorator="['publistTime', { rules: [{ required: true, message: '请输入' }]}]"
                           placeholder="请选择时间"/>
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea class="disabled-cover" :disabled="isSee"
                        v-decorator="['intro', { rules: [{ required: true, message: '请输入' }]}]"
                        placeholder="请输入"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="附件">
            <a-upload-dragger
              name="file"
              :multiple="false"
              action="/api/file/singleUpload"
              @change="handleChange"
              v-decorator="['publishFile', { rules: [{ required: false, message: '请上传' }] }]"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">上传产品发布申请表（签字版）</p>
              <p class="ant-upload-hint">
                点击或将文件拖拽到这里上传
              </p>
            </a-upload-dragger>
          </a-form-item>
        </a-form>
        <div class="footer">
          <a-button :style="{marginRight: '8px'}" @click="onClose">
            取消
          </a-button>
          <a-button @click="handleOk" type="primary">提交</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {productPublish} from '@api/productManage'
import util from '@util/util'

export default {
  components: {},
  props: {
    showDrawer: {
      type: Boolean,
      default () {
        return false
      }
    },
    isSee: {
      type: Boolean,
      default () {
        return false
      }
    },
    params: Object
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  mounted () {
  },
  methods: {
    onClose (refresh) {
      this.$emit('close', refresh)
    },
    // 弹框确认按钮
    handleOk () {
      let _this = this
      this.form.validateFields((err, values) => {
        // if (values.publishFile && values.publishFile.fileList && values.publishFile.fileList.length === 0) {
        //   _this.$message.error('请上传产品发布申请表（签字版）')
        //   return
        // }
        if (!err) {
          if (values.publishFile) {
            values.publishFile = util.convertFile(values.publishFile.fileList, 'pp')
          }
          values.publistTime = util.formatDate(values.publistTime.valueOf())
          values.productId = _this.params.id
          productPublish(values).then((data) => {
            this.onClose('refresh')
            _this.$message.success('已提交')
          }).catch((err) => {
            console.log('提交错误：' + err)
          })
        }
      })
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success('上传成功')
      } else if (status === 'error') {
        this.$message.error('上传失败')
      } else if (status === 'removed') {
        this.form.setFieldsValue({'publishFile': undefined}) // 此方法没有达到期待效果；todo
      }
    }
  },
  watch: {
    showDrawer (val, oldVal) {
      if (val === true) {
      }
    }
  }
}
</script>
<style scoped lang="less">
  @import "~@var";
</style>
