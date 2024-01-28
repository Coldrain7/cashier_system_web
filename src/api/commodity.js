import http from '@http/http'
export const commodityPage = query => http.GET('./api/commodity/commodityPage', query)
export const updateCommodity = commodity => http.GET('./api/commodity/updateCommodity', commodity)
