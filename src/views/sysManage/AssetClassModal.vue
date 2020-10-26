<!--编辑&新增类目弹出框【暂废弃】-->
<template>
  <div>
    <form-modal :showModal="showModal" @cancel="closeModal()" :title="modalTitle" :params="modalParams" @ok="handleSubmit()">
      <ul class="form-box">
        <li>
          <span class="title">类目名称：</span>
          <a-input class="content" placeholder="请输入类目名称"
                   v-decorator="['note', { rules: [{ required: true, message: '请输入类目名称' }] }]"
          />
        </li>
      </ul>
    </form-modal>
  </div>
</template>
<script>
import {addAssetClass} from '@api/sysManage'
import FormModal from '../../components/modal/FormModal'

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
    params: {
      type: Object,
      required: false
    }
  },
  components: {
    FormModal
  },
  data () {
    return {
      confirmLoading: false
    }
  },
  methods: {
    handleOk (e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
      addAssetClass({parentId: 0}).then((data) => {

      }).catch((error) => {
        console.log('新增子类目error:' + error)
      }
      )
    },
    handleCancel (e) {
      this.$emit('close')
    }
  }
}
</script>
