import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import permission from './permission'
import store from '../store/'
import { clearHttpRequestingList } from '@http/httpRequestList'
import routes from './routes'

Vue.$httpRequestList = []
Vue.use(Router)

let router = new Router({
  routes
})
// 每次路由跳转都到这步，先看是否需要登录
// 如果需要登录，看前端是否存储了当前用户信息；有则验证权限，否则从后端获取，后端不能获取不能过去
router.beforeEach((to, from, next) => {
  if (to.meta.keepAlive) {
    store.commit('routecache/keepAlive', to.name)
  }
  clearHttpRequestingList()
  // 进度条开始
  NProgress.start()
  // store是浏览器缓存的一种技术
  const whiteList = store.getters['permission/getWhiteList']
  // 判断是否属于白名单，是就直接放走
  if (whiteList.indexOf(to.name) > -1 || whiteList.indexOf(to.path) > -1) {
    next()
  } else if (!store.getters['user/getUserId']) { // 从前端获取当前用户id，！表示取反，即没拿到
    // 发请求去后端
    store.dispatch('user/fetchUserInfo').then(res => {
      if (res.status) {
        // 权限校验
        permission(store, routes, to, next)
      } else {
        switch (res.code) {
          case -500:
            next({ name: 'badGateway' })
            break
          case 70005:
            next({ name: 'login' })
            break
        }
      }
    })
  } else {
    // 权限校验
    permission(store, routes, to, next)
  }
})
router.afterEach(() => {
  NProgress.done()
})
export default router
