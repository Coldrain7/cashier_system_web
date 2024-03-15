export default {
  sidebarMap: {
    1: {// 角色为1的用户
      main: [
        {
          path: '/main/bookList',
          icon: 'suncaper-menu-unfold',
          title: '图书列表'
        },
        {
          path: '/main/overview',
          icon: 'suncaper-menu-unfold',
          title: '概览'
        },
        {
          path: '/main/commodity',
          icon: 'suncaper-menu-unfold',
          title: '商品',
          group: 'commodity',
          children: [
            {
              path: '/main/commodity/commodity',
              icon: 'suncaper-menu-unfold',
              title: '商品资料'
            },
            {
              path: '/main/commodity/classification',
              icon: 'suncaper-menu-unfold',
              title: '商品分类'
            },
            {
              path: '/main/commodity/combination',
              icon: 'suncaper-menu-unfold',
              title: '组合拆分'
            },
            {
              path: '/main/commodity/expiration',
              icon: 'suncaper-menu-unfold',
              title: '库存预警'
            }
          ]
        },
        {
          path: '/main/member',
          icon: 'suncaper-menu-unfold',
          title: '会员',
          group: 'member',
          children: [
            {
              path: '/main/member/member',
              icon: 'suncaper-menu-unfold',
              title: '会员资料'
            }
          ]
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
