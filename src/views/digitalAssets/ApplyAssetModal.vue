<template>
  <a-modal
    width="640px"
    title="发起审批-申请使用"
    :visible="showModal"
    :confirmLoading="confirmLoading"
    :destroyOnClose = true
    @cancel = "close"
    :params="params"
    class="form-modal"
    @ok="handleSubmit()">
    <a-form :form="form" class="form-box" hideRequiredMark>
      <a-form-item label="资产名称：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-cascader class="content" style="width: 396px"
                    :options="modalSelectList" placeholder="请选择资产名称"
                    v-decorator="['flowName', { rules: [{ required: true, message: '请输入资产名称' }], initialValue:selectDefault }]">
<!--          <template slot="displayRender" slot-scope="{labels, selectedOptions}">-->
<!--              <span v-for="(label, index) in labels" :key="selectedOptions[index].value">-->
<!--                <span v-if="index === labels.length - 1">-->
<!--                  {{label}}-->
<!--                </span>-->
<!--              </span>-->
<!--          </template>-->
        </a-cascader>
      </a-form-item>
      <a-form-item label="使用期限："  :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-range-picker :placeholder="['开始时间', '结束时间']" style="width: 396px"
                   v-decorator="['applyDate', { rules: [{ required: true, message: '请输入使用期限' }] }]"
          ></a-range-picker>
      </a-form-item>
      <a-form-item label="用途："  :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-textarea style="width: 396px" :rows="4" class="content" placeholder="请输入用途"
                    v-decorator="['applyReason', { rules: [{ required: true, message: '请输入用途' }] }]"
        />
      </a-form-item>
    </a-form>
      <!--        <li>-->
      <!--          <span class="title title-4">附件：</span>-->
      <!--          <a-upload class="content"-->
      <!--                    action="/file/singleUpload"-->
      <!--                    :data="uploadParams"-->
      <!--                    name="file"-->
      <!--                    :multiple="true"-->
      <!--                    :headers="headers"-->
      <!--                    @change="uploadChange"-->
      <!--          >-->
      <!--            <a-button> <a-icon type="upload" /> 上传附件 </a-button>-->
      <!--          </a-upload>-->
      <!--        </li>-->
  </a-modal>
</template>
<script>
import {getAssetsTypePathList, getAssetsTypeList, applyAssets} from '@api/digitalAssets'
import util from '@util/util'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
export default {
  components: {},
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    params: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      confirmLoading: false,
      selectDefault: [],
      modalSelectList: [],
      // fileList: [],
      // uploadParams: '',
      // headers: {
      //   authorization: 'authorization-text'
      // },
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    let _this = this
    getAssetsTypeList().then(function (data) {
      let rec = util.convertCascaderData(data.data, 'id', 'name')
      _this.modalSelectList = rec
    }).catch(function (error) {
      console.log('获取资产下拉选择数据报错：' + error)
    })
  },
  methods: {
    // 关闭弹框
    close () {
      this.$emit('close')
    },
    // 弹框确认按钮
    handleSubmit (e) {
      let _this = this
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          let len = values.flowName.length
          values['startTime'] = util.formatDate(values.applyDate[0].valueOf())
          values['endTime'] = util.formatDate(values.applyDate[1].valueOf())
          values['flowName'] = values.flowName.slice(len - 1, len)[0]
          values['assetsItemId'] = this.params.id
          delete values['applyDate']
          // assetsItemFile: JSON.stringify(this.fileList)
          applyAssets(values).then((data) => {
            _this.confirmLoading = false
            _this.$message.success('已提交申请，请等待审批')
            _this.$router.push({path: '/workflowList'})
          }).catch((error) => {
            _this.confirmLoading = false
            console.log('申请error:' + error)
          }
          )
        }
      })
    },
    // 废弃
    uploadChange ({ file, fileList }) {
      if (file.status === 'done' || file.status === 'removed') {
        this.fileList = []
        if (fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            this.fileList.push(fileList[i].response.data)
          }
        }
      }
    }
  },
  watch: {
    showModal (newV, oldV) {
      if (newV === true) {
        let id = this.params.id
        let _this = this
        getAssetsTypePathList({id: id}).then(function (rec) {
          _this.modalName = rec.data.split(',')
          _this.selectDefault = rec.data.split(',')
        }).catch(function (error) {
          console.log('获取资产默认选择数据报错：' + error)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
