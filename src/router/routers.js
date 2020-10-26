const Error = () => import('@/views/Error')
const Main = () => import('@/views/Main')
const ManageHome = () => import('@/views/workbench/ManageHome')
const RoleList = () => import('@/views/userManage/RoleList')
const UserList = () => import('@/views/userManage/UserList')
const Login = () => import('@/views/login/Login')
const LoginWeibo = () => import('@/views/login/LoginWeibo')
const RegisterTip = () => import('@/views/login/RegisterTip')
const DeptManage = () => import('@/views/sysManage/DeptManage')
const AssetClassManage = () => import('@/views/sysManage/AssetClassManage')
const menuManage = () => import('@/views/sysManage/menuManage')
const AssetList = () => import('@/views/digitalAssets/AssetList')
const WorkflowList = () => import('@/views/workflow/WorkflowList')
const WorkflowFlowBList = () => import('@/views/workflow/WorkflowFlowBList')
const NoticeList = () => import('@/views/notice/NoticeList')
const Index = () => import('@/views/home/Index')
const Building = () => import('@/views/home/Building')
const Home = () => import('@/views/home/Home')
const AuthorizeList = () => import('@/views/weixinManage/AuthorizeList')
const EnterHilookDailyList = () => import('@/views/weixinManage/EnterHilookDailyList')
const ProductList = () => import('@/views/productManage/ProductList')
const ProductDetail = () => import('@/views/productManage/ProductDetail')
const ProductPlanList = () => import('@/views/productManage/ProductPlanList')
const SignList = () => import('@/views/workbench/SignList')
const ProductPlanFeedbackDrawer = () => import('@/views/productManage/ProductPlanFeedbackDrawer')
const AssetCheckLog = () => import('@/views/digitalAssets/AssetCheckLog')

const Test = () => import('@/views/Test')

/**
 * 层级关系，meta.title都影响面包屑显示
 */
export default [
  {
    path: '*',
    redirect: '/manageHome'
  },
  {
    name: 'error',
    path: '/error',
    component: Error,
    meta: {
      title: '错误',
      noLogin: true // 不用登录拦截
    }
  },
  {
    name: 'home',
    path: '/home',
    component: Home,
    children: [{
      name: 'index',
      path: '/index',
      component: Index,
      meta: {
        title: '主页',
        noLogin: true // 不用登录拦截
      }
    },
    {
      name: 'building',
      path: '/building',
      component: Building,
      meta: {
        title: '正在建设中',
        noLogin: true
      }
    }]
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录',
      noLogin: true // 不用登录拦截
    }
  },
  {
    name: 'loginWeibo',
    path: '/loginWeibo',
    component: LoginWeibo,
    meta: {
      title: '登录-微博',
      noLogin: true // 不用登录拦截
    }
  },
  {
    name: 'registerTip',
    path: '/registerTip',
    component: RegisterTip,
    meta: {
      title: '返回登录页',
      noLogin: true // 不用登录拦截
    }
  },
  {
    name: 'test',
    path: '/test',
    component: Test,
    meta: {
      title: '测试页'
    }
  },
  {
    name: 'platform',
    path: '/platform',
    redirect: '/manageHome',
    component: Main,
    meta: {
      title: '工作台'
    },
    children: [
      {
        name: 'manageHome',
        path: '/manageHome',
        component: ManageHome,
        meta: {
          title: '我的工作台'
        }
      },
      {
        name: 'noticeList',
        path: '/noticeList',
        component: NoticeList,
        meta: {
          title: '通知提醒'
        }
      },
      {
        name: 'signList',
        path: '/signList',
        component: SignList,
        meta: {
          title: '签章存档'
        }
      }
    ]
  },
  {
    name: 'rights',
    path: '/rights',
    redirect: '/roleList',
    component: Main,
    meta: {
      title: '权限管理'
    },
    children: [
      {
        name: 'roleList',
        path: '/roleList',
        component: RoleList,
        meta: {
          title: '角色权限管理'
        }
      },
      {
        name: 'userList',
        path: '/userList',
        component: UserList,
        meta: {
          title: '用户管理'
        }
      }
    ]
  },
  {
    name: 'sys',
    redirect: '/deptManage',
    path: '/sys',
    component: Main,
    meta: {
      title: '系统配置'
    },
    children: [
      {
        name: 'deptManage',
        path: '/deptManage',
        component: DeptManage,
        meta: {
          title: '小微管理'
        }
      }, {
        name: 'assetClassManage',
        path: '/assetClassManage',
        component: AssetClassManage,
        meta: {
          title: '资产类目管理'
        }
      }, {
        name: 'menuManage',
        path: '/menuManage',
        component: menuManage,
        meta: {
          title: '菜单管理'
        }
      }
    ]
  },
  {
    name: 'digitalAssets',
    redirect: 'assetList_1',
    path: '/digitalAssets',
    component: Main,
    meta: {
      title: '数字资产管理'
    },
    children: [
      {
        name: 'assetList_1',
        path: '/assetList_1',
        component: AssetList,
        meta: {
          title: '基础公共资产'
        }
      },
      {
        name: 'assetList_2',
        path: '/assetList_2',
        component: AssetList,
        meta: {
          title: 'IT技术资产'
        }
      },
      {
        name: 'assetList_3',
        path: '/assetList_3',
        component: AssetList,
        meta: {
          title: '传播交互资产'
        }
      },
      {
        name: 'assetList_4',
        path: '/assetList_4',
        component: AssetList,
        meta: {
          title: '共享账号资产'
        }
      },
      {
        name: 'assetList_0',
        path: '/assetList_0',
        component: AssetList,
        meta: {
          title: '资产搜索'
        }
      },
      {
        name: 'asset_log',
        path: '/asset_log',
        component: AssetCheckLog,
        meta: {
          title: '资产操作日志'
        }
      }
    ]
  },
  {
    name: 'workflowFlowB',
    redirect: 'workflowFlowBList',
    path: '/workflowFlowB',
    component: Main,
    meta: {
      title: '工作流'
    },
    children: [
      {
        name: 'workflowFlowBList',
        path: '/workflowFlowBList',
        component: WorkflowFlowBList,
        meta: {
          title: '我的工作流'
        }
      }
    ]
  },
  {
    name: 'workflow',
    redirect: 'workflowList',
    path: '/workflow',
    component: Main,
    meta: {
      title: '工作流'
    },
    children: [
      {
        name: 'workflowList',
        path: '/workflowList',
        component: WorkflowList,
        meta: {
          title: '我的工作流'
        }
      }
    ]
  },
  {
    name: 'weixinManage',
    redirect: '/authorizeList',
    path: '/weixinManage',
    component: Main,
    meta: {
      title: '小程序端管理'
    },
    children: [
      {
        name: 'authorizeList',
        path: '/authorizeList',
        component: AuthorizeList,
        meta: {
          title: '账号授权'
        }
      },
      {
        name: 'enterHilookDailyList',
        path: '/enterHilookDailyList',
        component: EnterHilookDailyList,
        meta: {
          title: '人单合一日报'
        }
      }
    ]
  },
  {
    name: 'productManage',
    redirect: '/productList',
    path: '/productManage',
    component: Main,
    meta: {
      title: '产品管理'
    },
    children: [
      {
        name: 'productList',
        path: '/productList',
        component: ProductList,
        meta: {
          title: '产品总览'
        }
      },
      {
        name: 'productDetail',
        path: '/productDetail',
        component: ProductDetail,
        meta: {
          title: '产品详情'
        }
      },
      {
        name: 'productPlanList',
        path: '/productPlanList',
        component: ProductPlanList,
        meta: {
          title: '产品计划'
        }
      },
      {
        name: 'ProductPlanFeedbackDrawer',
        path: '/feedback',
        component: ProductPlanFeedbackDrawer,
        meta: {
          title: '反馈产品计划'
        }
      }
    ]
  }
]
