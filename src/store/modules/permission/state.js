export default {
  // 白名单
  whiteList: ['/', 'notFound', 'login', 'forbidden', 'badGateway', 'forgetPassword', 'register'],
  permissionMap: {
    1: {
      main: ['*']
    },
    2: {
      cashier: ['*']
    }
  }
}
