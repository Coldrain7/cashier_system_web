import http from '@http/http'
export const commodityPage = query => http.GET('./api/commodity/commodityPage', query)
export const updateCommodity = commodity => http.GET('./api/commodity/updateCommodity', commodity)
export const deleteCommodityById = commodity => http.DELETE(`./api/commodity/deleteCommodity/${commodity.id}`, commodity)
export const addCommodity = commodity => http.GET('./api/commodity/createCommodity', commodity)
export const getCommodityById = query => http.GET(`./api/commodity/getCommodity/${query.id}`, query)
