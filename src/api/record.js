import http from '@http/http'
export const sellCommodities = query => http.POST('./api/record/sellCommodities', query)
