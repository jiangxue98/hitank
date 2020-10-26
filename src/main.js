// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import 'babel-polyfill'
import router from './router'
// import 'ant-design-vue/dist/antd.css'
// import '@style/base.less'
// import '@style/common.less'
// import '@util/tableUtil'
import VueParticles from 'vue-particles'

import {
  Button,
  Icon,
  Menu,
  Layout,
  Breadcrumb,
  Table,
  Input,
  Popconfirm,
  message,
  Form,
  Checkbox,
  Cascader,
  Select,
  Modal,
  Row,
  Col,
  DatePicker,
  Upload,
  Drawer,
  Radio,
  LocaleProvider,
  Pagination,
  Tooltip,
  Tree,
  Avatar,
  Badge,
  Tabs,
  Timeline,
  ConfigProvider,
  AutoComplete,
  Alert,
  Dropdown
} from 'ant-design-vue'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.use(VueParticles)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(Layout)
Vue.use(Breadcrumb)
Vue.use(Table)
Vue.use(Input)
Vue.use(Popconfirm)
Vue.use(message)
Vue.use(Form)
Vue.use(Checkbox)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Modal)
Vue.use(Row)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Drawer)
Vue.use(Radio)
Vue.use(LocaleProvider)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Avatar)
Vue.use(Badge)
Vue.use(Tabs)
Vue.use(Timeline)
Vue.use(ConfigProvider)
Vue.use(AutoComplete)
Vue.use(Alert)
Vue.use(Dropdown)

Vue.prototype.$message = message
Vue.prototype.$moment = moment
Vue.prototype.$confirm = Modal.confirm
// 新版审批流程开关，默认开
Vue.prototype.flowB = true

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: { App },
  // template: '<App/>',
  render: h => h(App)
})
