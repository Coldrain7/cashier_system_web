import http from '@http/http'
export const _getUserInfo = (errMsg) => http.GET('/api/auth/userInfo', {}, errMsg)
export const userLogin = user => http.POST('./api/worker/login', user)
export const adminRegister = admin => http.POST('./api/worker/adminRegister', admin)
export const registerMessage = user => http.POST('./api/worker/registerMessage', user)
export const sendCode = user => http.GET('./api/worker/sendCode', user)
export const checkCode = code => http.GET('./api/worker/checkCode', code)
