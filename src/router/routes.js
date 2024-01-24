const loginPage = [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../pages/login/Login')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () =>
        import(/* webpackChunkName: "Login" */ '../pages/login/ForgetPassword.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () =>
        import(/* webpackChunkName: "Login" */ '../pages/login/Register.vue')
  }
]
// 需要登录访问的路由写在main里
const mainPage = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    // 父级
    path: '/main',
    name: 'main',
    component: () =>
      import(/* webpackChunkName: "Main" */ '../pages/main/Main'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () =>
            import(
              /* webpackChunkName: "Second" */ '../pages/main/routes/overview/Overview.vue'
            )
      },
      {
        path: 'commodity/commodity',
        name: 'commodity',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/commodity/Commodity.vue'
            )
      },
      {
        path: 'bookList',
        name: 'bookList',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/book/list'
            )
      },
      {
        path: 'member/member',
        name: 'member',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/member/Member.vue'
            )
      }
    ]
  }
]

const errorPage = [
  {
    path: '/notFound',
    name: 'notFound',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '../pages/error/NotFound')
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () =>
      import(/* webpackChunkName: "Forbidden" */ '../pages/error/Forbidden')
  },
  {
    path: '/badGateway',
    name: 'badGateway',
    component: () =>
      import(/* webpackChunkName: "BadGateway" */ '../pages/error/BadGateway')
  },
  {
    path: '*',
    redirect: '/notFound'
  }
]
export default [...loginPage, ...mainPage, ...errorPage]
