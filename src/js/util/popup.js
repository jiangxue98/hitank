import Vue from 'vue/types/vue'
import {message, Modal} from 'ant-design-vue'

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message

Vue.use(Modal)
Vue.use(message)
