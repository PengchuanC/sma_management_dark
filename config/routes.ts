export default [
  {
    path: "/",
    redirect: '/portfolio/glance'
  },
  {
    path: '/portfolio',
    name: '组合管理',
    icon: 'FundViewOutlined',
    routes: [
      {
        'path': '/portfolio',
        redirect: '/portfolio/glance'
      },
      {
        path: '/portfolio/glance',
        name: '首页概览',
        icon: 'AppstoreOutlined',
        component: 'portfolio/glance/index'
      },
      {
        path: '/portfolio/overview',
        name: '账户总览',
        icon: 'FundOutlined',
        component: 'portfolio/overview/index'
      },
      {
        path: '/portfolio/analysis',
        name: '投资分析',
        icon: 'BarChartOutlined',
        component: 'portfolio/analysis/index'
      },
      {
        path: '/portfolio/history',
        name: '投资历史',
        icon: 'HistoryOutlined',
        component: 'portfolio/history/index'
      },
      {
        path: '/portfolio/mock',
        name: '调仓贡献',
        icon: 'DotChartOutlined',
        component: 'portfolio/mock/index'
      },
    ]
  },
  {
    path: '/warehouse',
    name: '模拟投资',
    icon: 'PercentageOutlined',
    component: 'warehouse/index'
  },
  {
    path: '/allocate',
    name: '资产配置',
    icon: 'FunctionOutlined',
    component: 'allocate/index'
  },
  {
    path: '/capital',
    name: '资金流向',
    icon: 'FieldNumberOutlined',
    component: 'capitalflow/index'
  },
  {
    path: '/change',
    name: '盘中估值',
    icon: 'DollarCircleOutlined',
    component: 'change/index'
  },
  {
    path: '/announcement',
    component: 'announcement/index',
    hideInMenu: true
  },
  {
    component: './404',
  }
];
