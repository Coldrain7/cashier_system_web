import { _getUserInfo } from '@api/user'

import types from './types'
export default {
  async fetchUserInfo ({ commit }) {
    // await是同步的意思
    let res = await _getUserInfo()
    if (res.status) {
      // 把登录信息存进前端缓存
      commit(types.SET_USER_ID, res.data.id)
      commit(types.SET_USER_NAME, res.data.name)
      commit(types.SET_USER_TYPE, res.data.userType)
    }
    return res
  },
  async clearUserInfo ({ commit }) {
    // 把登录信息存进前端缓存
    commit(types.SET_USER_ID, null)
    commit(types.SET_USER_NAME, null)
    commit(types.SET_USER_TYPE, null)
  }
}
