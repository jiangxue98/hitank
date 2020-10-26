<!--菜单管理-->
<template>
 <div>
   <div class="relative asset-class-manage">
<!--     <div class="header-right">-->
<!--       <a-input-search-->
<!--         placeholder="请输入菜单名称"-->
<!--         style="width: 240px"-->
<!--         @search="onSearch"-->
<!--       /></div>-->
     <div class="table-box">
       <div class="clearfix">
         <div class="title fl">菜单管理</div>
         <a-button class="editable-add-btn btn-theme right-btn" @click="handleHeaderAdd"><a-icon type="plus" />新增菜单</a-button>
       </div>
       <a-table :columns="columns"
                :dataSource="data"
                :loading="loading">
         <template slot="operation" slot-scope="text, record, index">
           <a class="themeColor" @click="() => handleAdd(text, record, index)"><a-icon type="plus" />增加子菜单</a>
           <i class="btn-sep" ></i>
           <a-tooltip placement="top">
             <template slot="title">
               <span>编辑</span>
             </template>
             <a-icon class="grey-btn" type="form" @click="() => handleEdit(text, record, index)"/>
           </a-tooltip>
           <i class="btn-sep" ></i>
           <a-tooltip placement="top">
             <template slot="title">
               <span>删除</span>
             </template>
             <a-icon class="grey-btn" type="delete" @click="() => handleDelete(record.key, record.name)"/>
           </a-tooltip>
         </template>
       </a-table>
     </div>
     <a-modal
       width="640px"
       :title="modalTitle"
       :visible="showModal"
       :destroyOnClose = true
       @cancel = "closeModal()"
       @ok="modalHandleOk()"
       :params="params"
       :maskClosable="false"
     >
       <a-form :form="form" hideRequiredMark class="form-box">
         <a-form-item label="菜单名称：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-input
             v-decorator="['name', { rules: [{ required: true, message: '请输入菜单名称'}], initialValue: modalParams.name}]"
             placeholder="请输入菜单名称"
           />
         </a-form-item>
         <a-form-item label="是否显示：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-select :defaultValue="options[i]" @change="handleMenuClick" style="width: 396px">
             <a-select-option v-for="(item,i) in options" :key="i">{{options[i]}}</a-select-option>
           </a-select>
         </a-form-item>
         <a-form-item label="序号：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-input
             v-decorator="['sort',{initialValue: modalParams.sort}]"
             placeholder="请输入序号"/>
         </a-form-item>
         <a-form-item label="链接：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-input
             v-decorator="['href',{ rules:[{ required: true, message: '请输入链接'}], initialValue: modalParams.href}]"
             placeholder="请输入链接"/>
         </a-form-item>
         <a-form-item label="图标：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-input
             v-decorator="['icon',{initialValue: modalParams.icon}]"
             placeholder="请输入图标"/>
         </a-form-item>
         <a-form-item label="权限：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
           <a-input
             v-decorator="['permission',{initialValue: modalParams.permission}]"
             placeholder="请输入权限"/>
         </a-form-item>
       </a-form>
     </a-modal>
   </div>
 </div>
</template>

<script>
import {getMenulistManage, updateMenuList, deleteMenu} from '@api/sysManage'
import util from '@util/util'
import eventBus from '@/store/eventBus'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const columns = [{
  title: '菜单名称',
  dataIndex: 'name',
  key: 'id',
  width: '13%',
  scopedSlots: { customRender: 'name' }
}, {
  title: '序号',
  dataIndex: 'id',
  key: 'id',
  width: '6%',
  scopedSlots: { customRender: 'id' }
},
{
  title: '权限',
  dataIndex: 'permission',
  key: 'id',
  width: '10%',
  scopedSlots: { customRender: 'permission' }
}, {
  title: '操作',
  align: 'right',
  scopedSlots: { customRender: 'operation' },
  width: '30%'
}]
const options = ['否', '是']
export default {
  data () {
    return {
      data: [],
      columns,
      formItemLayout,
      options,
      form: this.$form.createForm(this),
      loading: false,
      pagination: util.TABLE.pagination,
      showModal: false,
      modalParams: {},
      params: {},
      modalTitle: '',
      menuName: '',
      href: '',
      parentId: 0,
      i: 1
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // 获取菜单列表
    fetch (params = {}) {
      this.loading = true
      let _this = this
      getMenulistManage(params).then(function (data) {
        _this.loading = false
        if (data.success) {
          let arr = []
          if (data.data.length > 0) {
            arr = util.convertTableTreeData(data.data, 'id')
          }
          const pagination = { ..._this.pagination }
          pagination.total = data.total
          _this.pagination = pagination
          _this.data = arr
        }
      }).catch(function (error) {
        _this.loading = false
        console.log('获取菜单列表数据报错：' + error)
      })
    },
    // 是否显示菜单
    handleMenuClick (e) {
      if (e === 0) {
        this.params.isShow = 0
      } else {
        this.params.isShow = 1
      }
    },
    // 删除按钮
    handleDelete (key, name) {
      let _this = this
      util.delConfirm(name, () => {
        deleteMenu({id: key}).then((data) => {
          _this.$message.success('删除成功')
          _this.fetch()
          eventBus.$emit('refreshMenu')
        }).catch((error) => {
          console.log('删除菜单error:' + error)
        }
        )
      })
    },
    // 编辑名称
    handleEdit (text, record) {
      this.modalParams = record
      this.i = Number(this.modalParams.isShow)
      this.showModal = true
      this.modalTitle = '编辑菜单'
      this.parentId = this.modalParams.parentId
    },
    // 新增一级菜单
    handleHeaderAdd () {
      this.modalParams = {}
      this.showModal = true
      this.modalTitle = '新增菜单'
      this.parentId = 1
    },
    // 新增子菜单
    handleAdd (text, record) {
      this.modalParams = {}
      this.showModal = true
      this.modalTitle = '新增子菜单'
      this.parentId = record.id
    },
    // 关闭弹框
    closeModal () {
      this.showModal = false
    },
    // 弹框确认按钮
    modalHandleOk () {
      let _this = this
      this.form.validateFields((err, values) => {
        values.parentId = this.parentId
        values.id = this.modalParams.id
        this.modalParams.name = values.name
        this.modalParams.href = values.href
        this.modalParams.sort = values.sort
        this.modalParams.icon = values.icon
        this.modalParams.permission = values.permission
        if (!err) {
          updateMenuList(values).then((data) => {
            _this.fetch()
            eventBus.$emit('refreshMenu')
            this.showModal = false
          }).catch((error) => {
            console.log('新增子类目error:' + error)
          }
          )
        }
      })
    }
    // 条件筛选
  //   onSearch (value) {
  //     console.log(value)
  //     this.fetch({
  //       name: value
  //     })
  //   }
  }
}
</script>
<style scoped lang="less">
  .form-box input{
    width: 396px;
  }
</style>
