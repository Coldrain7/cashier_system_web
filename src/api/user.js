import http from '@http/http'
export const _getUserInfo = (errMsg) => http.GET('/api/auth/userInfo', {}, errMsg)
export const userLogin = user => http.POST('./api/worker/login', user)
export const adminRegister = admin => http.POST('./api/worker/adminRegister', admin)
export const registerMessage = user => http.POST('./api/worker/registerMessage', user)
export const sendCode = user => http.GET('./api/worker/sendCode', user)
export const checkCode = code => http.GET('./api/worker/checkCode', code)
export const getUserById = query => {
  const url = `./api/worker/${query.id}`
  return http.GET(url, query)
}
export const changePassword = user => http.POST('./api/worker/changePassword', user)
export const getSupIdById = user => http.GET('./api/worker/getSupId', user)
export const getSupWorkers = query => http.GET(`./api/worker/getSupWorkers/${query.supId}`, query)
export const getWorkersByName = worker => http.GET('./api/worker/getWorkersByName', worker)
export const deleteWorkerById = query => http.DELETE(`./api/worker/${query.id}`, query)
export const updateWorkerById = worker => http.POST('./api/worker/updateWorkerById', worker)
export const createWorker = worker => http.POST('./api/worker/createWorker', worker)
