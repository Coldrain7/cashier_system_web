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
          path: '/main/first',
          icon: 'suncaper-menu-unfold',
          title: '一级菜单1'
        },
        {
          path: '/main/second',
          icon: 'suncaper-menu-unfold',
          title: '一级菜单2',
          group: 'second',
          children: [
            {
              path: '/main/second/second',
              icon: 'suncaper-menu-unfold',
              title: '二级菜单'
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
