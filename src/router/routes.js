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
    path: '/cashier',
    name: 'cashier',
    component: () =>
        import(/* webpackChunkName: "Main" */ '../pages/main/routes/cashier/Cashier.vue')
  },
  {
    path: '/records',
    name: 'records',
    component: () =>
        import(/* webpackChunkName: "Main" */ '../pages/main/routes/cashier/Records.vue')
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
        path: 'commodity/supplier',
        name: 'supplier',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/commodity/Supplier.vue'
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
        path: 'commodity/classification',
        name: 'classification',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/commodity/Classification.vue'
            )
      },
      {
        path: 'commodity/combination',
        name: 'combination',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/commodity/Combination.vue'
            )
      },
      {
        path: 'commodity/expiration',
        name: 'expiration',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/commodity/Expiration.vue'
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
      },
      {
        path: 'worker/worker',
        name: 'worker',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/worker/Worker.vue'
            )
      }, {
        path: 'settings/settings',
        name: 'settings',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/settings/settings.vue'
            )
      }, {
        path: 'sale/sale',
        name: 'sale',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/sale/Sale.vue'
            )
      },
      {
        path: 'sale/proportion',
        name: 'proportion',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/sale/Proportion.vue'
            )
      },
      {
        path: 'sale/records',
        name: 'records',
        component: () =>
            import(
              /* webpackChunkName: "First" */ '../pages/main/routes/sale/Records.vue'
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
