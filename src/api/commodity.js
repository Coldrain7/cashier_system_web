import http from '@http/http'
export const commodityPage = query => http.GET('./api/commodity/commodityPage', query)
