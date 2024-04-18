export default {
  sidebarMap: {
    1: {// 角色为1的用户
      main: [
        {
          path: '/main/commodity',
          icon: 'el-icon-s-goods',
          title: '商品',
          group: 'commodity',
          children: [
            {
              path: '/main/commodity/commodity',
              icon: 'el-icon-goods',
              title: '商品资料'
            },
            {
              path: '/main/commodity/classification',
              icon: 'el-icon-files',
              title: '商品分类'
            },
            {
              path: '/main/commodity/combination',
              icon: 'el-icon-box',
              title: '组合拆分'
            },
            {
              path: '/main/commodity/expiration',
              icon: 'el-icon-bell',
              title: '库存预警'
            },
            {
              path: '/main/commodity/supplier',
              icon: 'el-icon-s-home',
              title: '供应商'
            }
          ]
        },
        {
          path: '/main/member',
          icon: 'el-icon-user-solid',
          title: '会员',
          group: 'member',
          children: [
            {
              path: '/main/member/member',
              icon: 'el-icon-user',
              title: '会员资料'
            }
          ]
        },
        {
          path: '/main/sale',
          icon: 'el-icon-s-marketing',
          title: '销售',
          group: 'sale',
          children: [
            {
              path: '/main/sale/sale',
              icon: 'el-icon-s-data',
              title: '营业趋势'
            },
            {
              path: '/main/sale/proportion',
              icon: 'el-icon-pie-chart',
              title: '分类占比'
            },
            {
              path: '/main/sale/records',
              icon: 'el-icon-s-order',
              title: '销售单据'
            },
            {
              path: '/main/sale/predictSelling',
              icon: 'el-icon-data-analysis',
              title: '销售预测'
            }
          ]
        },
        {
          path: '/main/event/event',
          icon: 'el-icon-s-management',
          title: '营销活动'
        },
        {
          path: '/main/worker',
          icon: 'el-icon-s-custom',
          title: '员工',
          group: 'worker',
          children: [
            {
              path: '/main/worker/worker',
              icon: 'el-icon-s-custom',
              title: '员工管理'
            }
          ]
        }, {
          path: '/main/settings/settings',
          icon: 'el-icon-setting',
          title: '设置'
        }
      ]
    },
    2: {
      main: [
        {
          path: '/main/bookList',
          icon: 'suncaper-menu-unfold',
          title: '图书列表'
        }
      ]
    },
    3: {// 角色为3的用户
      main: [
        {
          path: '/main/commodity',
          icon: 'el-icon-s-goods',
          title: '商品',
          group: 'commodity',
          children: [
            {
              path: '/main/commodity/commodity',
              icon: 'el-icon-goods',
              title: '商品资料'
            },
            {
              path: '/main/commodity/classification',
              icon: 'el-icon-files',
              title: '商品分类'
            },
            {
              path: '/main/commodity/combination',
              icon: 'el-icon-box',
              title: '组合拆分'
            },
            {
              path: '/main/commodity/expiration',
              icon: 'el-icon-bell',
              title: '库存预警'
            },
            {
              path: '/main/commodity/supplier',
              icon: 'el-icon-s-home',
              title: '供应商'
            }
          ]
        },
        {
          path: '/main/member',
          icon: 'el-icon-user-solid',
          title: '会员',
          group: 'member',
          children: [
            {
              path: '/main/member/member',
              icon: 'el-icon-user',
              title: '会员资料'
            }
          ]
        },
        {
          path: '/main/sale',
          icon: 'el-icon-s-marketing',
          title: '销售',
          group: 'sale',
          children: [
            {
              path: '/main/sale/sale',
              icon: 'el-icon-s-data',
              title: '营业趋势'
            },
            {
              path: '/main/sale/proportion',
              icon: 'el-icon-pie-chart',
              title: '分类占比'
            },
            {
              path: '/main/sale/records',
              icon: 'el-icon-s-order',
              title: '销售单据'
            },
            {
              path: '/main/sale/predictSelling',
              icon: 'el-icon-data-analysis',
              title: '销售预测'
            }
          ]
        },
        {
          path: '/main/event/event',
          icon: 'el-icon-s-management',
          title: '营销活动'
        }
      ]
    }
  },
  sidebarTheme: {
    dark: {
      background: '#1f2c35',
      text: '#ffffff',
      activeText: '#ffffff'
    },
    light: {
      background: '#ffffff',
      text: '#000000',
      activeText: '#1890ff'
    }
  }
}
