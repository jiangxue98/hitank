const TEXT = {
  OK: '确认',
  CANCEL: '取消'
}

// 不显示面包屑标题的页面name
const NO_TITLE_VIEWS = [
  'manageHome',
  'productDetail',
  'productPlanList'
]
// 不显示面包屑标题北京的页面name
const NO_TITLE_BG_VIEWS = [
  'manageHome',
  'productDetail'
]

const PRODUCT_TYPE = [
  {name: 'PC', value: '1'},
  {name: 'APP', value: '2'},
  {name: 'H5', value: '3'},
  {name: '小程序', value: '4'},
  {name: '客户端', value: '5'},
  {name: '其它', value: '6'}
]

const PRODUCT_TYPE_OBJ = {
  '1': 'pc', '2': 'APP', '3': 'H5', '4': '小程序', '5': '客户端', '6': '其它'
}

export default {
  TEXT,
  NO_TITLE_VIEWS,
  NO_TITLE_BG_VIEWS,
  PRODUCT_TYPE,
  PRODUCT_TYPE_OBJ
}
